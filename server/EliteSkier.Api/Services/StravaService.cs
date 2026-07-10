using System.Text.Json;
using System.Net.Http.Headers;
using EliteSkier.Api.Repositories;
using EliteSkier.Api.Models;
using Microsoft.Extensions.Configuration;
using EliteSkier.Api.Dtos;

namespace EliteSkier.Api.Services;

public class StravaService : IStravaService
{
    private readonly IStravaRepository _stravaRepo;
    private readonly IWorkoutSessionRepository _workoutRepo;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly IHeartrateZoneService _heartrateZoneService;
    private readonly ILogger<StravaService> _logger;

    public StravaService(
        IStravaRepository stravaRepo,
        IWorkoutSessionRepository workoutRepo,
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        IHeartrateZoneService heartrateZoneService,
        ILogger<StravaService> logger)
    {
        _stravaRepo = stravaRepo;
        _workoutRepo = workoutRepo;
        _httpClientFactory = httpClientFactory;
        _config = config;
        _heartrateZoneService = heartrateZoneService;
        _logger = logger;
    }

    // Steg 1: Byter kod mot tokens vid första parkopplingen
    public async Task<bool> ExchangeCodeAndSaveAsync(int userId, string code)
    {
        var client = _httpClientFactory.CreateClient();

        var payload = new Dictionary<string, string>
        {
            { "client_id", _config["Strava:ClientId"] ?? "" },
            { "client_secret", _config["Strava:ClientSecret"] ?? "" },
            { "code", code },
            { "grant_type", "authorization_code" }
        };

        var response = await client.PostAsync("https://www.strava.com/oauth/token", new FormUrlEncodedContent(payload));
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError(
                "Strava token exchange misslyckades. Status: {StatusCode}, ClientId satt: {HasClientId}, ClientSecret satt: {HasClientSecret}, Svar: {Body}",
                response.StatusCode,
                !string.IsNullOrEmpty(_config["Strava:ClientId"]),
                !string.IsNullOrEmpty(_config["Strava:ClientSecret"]),
                errorBody);
            return false;
        }

        var jsonString = await response.Content.ReadAsStringAsync();
        using var json = JsonDocument.Parse(jsonString);
        var root = json.RootElement;

        var integration = new StravaIntegration
        {
            UserId = userId,
            StravaRefreshToken = root.GetProperty("refresh_token").GetString() ?? "",
            StravaAthleteId = root.GetProperty("athlete").GetProperty("id").GetInt64().ToString()
        };

        await _stravaRepo.UpsertIntegrationAsync(integration);
        return true;
    }

    // Huvudmetod för att hämta och spara ett nytt pass från Webhooken
    public async Task ProcessActivityAsync(long stravaActivityId, string stravaOwnerId)
{
    // 1. Hämta integrationen 
    var integration = await _stravaRepo.GetByStravaAthleteIdAsync(stravaOwnerId);
    if (integration == null) return;

    // 2. Skaffa en giltig Access Token från Strava
    string accessToken = await GetValidAccessTokenAsync(integration);
    if (string.IsNullOrEmpty(accessToken)) return;

    // 3. Hämta rå-datan via HTTP-anropen
    string activityJson = await FetchFromStravaAsync($"https://www.strava.com/api/v3/activities/{stravaActivityId}", accessToken);
    string streamsJson = await FetchFromStravaAsync($"https://www.strava.com/api/v3/activities/{stravaActivityId}/streams?keys=heartrate,time,moving&key_by_type=true", accessToken);

    if (string.IsNullOrEmpty(activityJson)) return;

    // 4. Parsa aktivitetens grundinfo
    using var activityDoc = JsonDocument.Parse(activityJson);
    var root = activityDoc.RootElement;

    string stravaSportType = root.TryGetProperty("sport_type", out var sportProp) ? sportProp.GetString() ?? "" : "";
    var localStartTime = DateTime.Parse(root.GetProperty("start_date_local").GetString() ?? DateTime.Now.ToString());
    int? avgHr = root.TryGetProperty("average_heartrate", out var hrProp) ? (int)Math.Round(hrProp.GetDouble()) : null;

    // 5. Räkna ut pulszonerna i sekunder
    var calculatedZones = new ZoneDto();

    if (!string.IsNullOrEmpty(streamsJson))
    {
        try
        {
            using var streamsDoc = JsonDocument.Parse(streamsJson);
            var streamsRoot = streamsDoc.RootElement;

            if (streamsRoot.TryGetProperty("heartrate", out var hrStreamObj) && 
    streamsRoot.TryGetProperty("time", out var timeStreamObj))
{
    var hrList = hrStreamObj.GetProperty("data").EnumerateArray().Select(x => x.GetInt32()).ToList();
    var timeList = timeStreamObj.GetProperty("data").EnumerateArray().Select(x => x.GetInt32()).ToList();
    
    // 1. Hämta ut moving-data (om den finns, annars gör vi en lista med bara 'true')
    List<bool> movingList;
    if (streamsRoot.TryGetProperty("moving", out var movingStreamObj))
    {
        movingList = movingStreamObj.GetProperty("data").EnumerateArray().Select(x => x.GetBoolean()).ToList();
    }
    else
    {
        movingList = Enumerable.Repeat(true, hrList.Count).ToList();
    }

    // 2. Uppdatera anropet till din service så den tar emot movingList!
    calculatedZones = await _heartrateZoneService.CalculateTimeInZonesAsync(integration.UserId, hrList, timeList, movingList);
}
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Kunde inte räkna ut pulszoner från streams: {ex.Message}");
        }
    }

    string safeStreamsJson = string.IsNullOrEmpty(streamsJson) ? "[]" : streamsJson;

    // Använd den säkra strängen istället
    var finalJsonRaw = $"{{\"activity\":{activityJson},\"streams\":{safeStreamsJson}}}";

    // 6. Skapa objektet med all data (inklusive de nya pulszonerna!)
    var workout = new WorkoutSession
    {
        UserId = integration.UserId,
        ExternalId = stravaActivityId.ToString(),
        IsLogged = false,
        Comment = string.Format("{0}{1}",
        root.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : "Strava-pass",
        root.TryGetProperty("description", out var descProp) && !string.IsNullOrEmpty(descProp.GetString()) 
        ? "\n\nBeskrivning:\n" + descProp.GetString() 
        : ""
        ),
        TimeOfDay = GetTimeOfDay(localStartTime),
        ScheduledDate = DateTime.SpecifyKind(
            DateTime.Parse(root.GetProperty("start_date").GetString() ?? DateTime.UtcNow.ToString()), 
            DateTimeKind.Utc
        ),
        ActivityId = MapStravaTypeToActivityId(stravaSportType),
        AvgHeartRate = avgHr,

        TizA1Actual = calculatedZones.A1,
        TizA2Actual = calculatedZones.A2,
        TizA3MinusActual = calculatedZones.A3Minus,
        TizA3Actual = calculatedZones.A3,
        TizA3PlusActual = calculatedZones.A3Plus,
        TizCompActual = calculatedZones.Comp,

        StravaRaw = finalJsonRaw
    };

    // 7. LÅT DITT REPO SKÖTA ALL LOGIK (Hitta, uppdatera eller spara ny)!
    await _workoutRepo.UpsertStravaWorkoutAsync(workout);
    Console.WriteLine($"Aktivitet {stravaActivityId} processades framgångsrikt via UpsertStravaWorkoutAsync!");
}

    #region Hjälpmetoder för Strava-kommunikation och mappning

    // Hämtar en färsk access token med hjälp av refresh token
    public async Task<string> GetValidAccessTokenAsync(StravaIntegration integration)
    {
        var client = _httpClientFactory.CreateClient();
        var payload = new Dictionary<string, string>
        {
            { "client_id", _config["Strava:ClientId"] ?? "" },
            { "client_secret", _config["Strava:ClientSecret"] ?? "" },
            { "refresh_token", integration.StravaRefreshToken },
            { "grant_type", "refresh_token" }
        };

        var response = await client.PostAsync("https://www.strava.com/oauth/token", new FormUrlEncodedContent(payload));
        if (!response.IsSuccessStatusCode) return "";

        var jsonString = await response.Content.ReadAsStringAsync();
        using var json = JsonDocument.Parse(jsonString);
        var root = json.RootElement;

        // Spara den nya refresh-token ifall den roterats
        integration.StravaRefreshToken = root.GetProperty("refresh_token").GetString() ?? integration.StravaRefreshToken;
        await _stravaRepo.UpsertIntegrationAsync(integration);

        return root.GetProperty("access_token").GetString() ?? "";
    }

    // Generisk metod för att göra GET-anrop mot Stravas API
    private async Task<string> FetchFromStravaAsync(string url, string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        
        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode) return "";

        return await response.Content.ReadAsStringAsync();
    }

    // Delar upp dygnet i textsträngar baserat på klockslag
    private string GetTimeOfDay(DateTime localTime)
    {
        int hour = localTime.Hour;
        if (hour >= 5 && hour < 10) return "Morgon";
        if (hour >= 10 && hour < 12) return "Förmiddag";
        if (hour >= 12 && hour < 14) return "Lunch";
        if (hour >= 14 && hour < 18) return "Eftermiddag";
        if (hour >= 18 && hour < 22) return "Kväll";
        return "Natt";
    }

    // Mappar Stravas sport_type mot dina idrotter i din DB
    private int MapStravaTypeToActivityId(string stravaSportType)
    {
        return stravaSportType switch
        {
            "NordicSki" => 1,
            "RollerSki" => 3,
            "MountainBikeRide" => 5,
            "Ride" => 6,
            "VirtualRide" => 6,
            "Run" => 7,
            "Hike" => 8,
            "Walk" => 8,
            "Swim" => 9,
            "WeightTraining" => 10,
            "Workout" => 10,
            "SkiErg" => 11,
            _ => 12 // Övrigt
        };
    }

    // 1. Kolla status via ditt repo
   // 1. Kolla status via ditt repo (Mappar mot din StravaIntegration-modell)
 public async Task<bool> HasActiveConnectionAsync(int userId)
    {
        Console.WriteLine($"[StravaService] Kollar status för userId: {userId}");
        
        // Hämta integrationen direkt från strava_integration via ditt repo
        StravaIntegration? integration = await _stravaRepo.GetByIdAsync(userId);
        
        if (integration == null)
        {
            Console.WriteLine("[StravaService] Repot returnerade NULL. Hittade ingen rad i strava_integration.");
            return false;
        }

        Console.WriteLine($"[StravaService] Rad hittad! Token i C#-modell: '{integration.StravaRefreshToken}'");

        // Om strängen inte är tom så är vi sammankopplade!
        return !string.IsNullOrEmpty(integration.StravaRefreshToken);
    }

    // 2. Koppla bort genom att nolla i tabellen via ditt repo
    public async Task<bool> DisconnectAsync(int userId)
    {
        Console.WriteLine($"[StravaService] Kopplar bort Strava för userId: {userId}");

        // Hämta rätt modell (StravaIntegration)
        StravaIntegration? integration = await _stravaRepo.GetByIdAsync(userId);
        if (integration == null) return false;

        // Eftersom ditt repo saknade "DeleteAsync", kör vi den säkra vägen:
        // Vi tömmer bara fälten och sparar (detta matchar bilden på din DB perfekt!)
        integration.StravaRefreshToken = string.Empty;
        integration.StravaAthleteId = string.Empty;

        // Uppdatera tabellen via ditt repo
        await _stravaRepo.UpsertIntegrationAsync(integration);
        
        Console.WriteLine("[StravaService] Bortkoppling sparad i databasen!");
        return true;
    }

    #endregion
}