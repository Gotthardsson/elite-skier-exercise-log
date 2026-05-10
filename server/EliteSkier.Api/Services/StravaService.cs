using System.Text.Json;
using EliteSkier.Api.Repositories;
using EliteSkier.Api.Models;
using Microsoft.Extensions.Configuration; // Viktigt för IConfiguration

namespace EliteSkier.Api.Services;

public class StravaService : IStravaService
{
    private readonly IStravaRepository _repo;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public StravaService(IStravaRepository repo, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _repo = repo;
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

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
        if (!response.IsSuccessStatusCode) return false;

        var jsonString = await response.Content.ReadAsStringAsync();
        using var json = JsonDocument.Parse(jsonString);
        var root = json.RootElement;

        var integration = new StravaIntegration
        {
            UserId = userId,
            StravaRefreshToken = root.GetProperty("refresh_token").GetString() ?? "",
            StravaAthleteId = root.GetProperty("athlete").GetProperty("id").GetInt64().ToString()
        };

        await _repo.UpsertIntegrationAsync(integration);
        return true;
    }
}