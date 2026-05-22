using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/strava/webhook")]
public class StravaWebhookController : ControllerBase
{
    private readonly IStravaService _stravaService;
    private readonly string _verifyToken = "Test1";

    public StravaWebhookController(IStravaService stravaService)
    {
        _stravaService = stravaService;
    }

    [HttpGet]
    public IActionResult Validate([FromQuery(Name = "hub.mode")] string mode,
                              [FromQuery(Name = "hub.challenge")] string challenge,
                              [FromQuery(Name = "hub.verify_token")] string token)
    {
        if (mode == "subscribe" && token == _verifyToken)
        {
            return Content($"{{\"hub.challenge\":\"{challenge}\"}}", "application/json");
        }
        return Forbid();
    }

    [HttpPost]
    public IActionResult ReceiveEvent([FromBody] StravaWebhookEvent stravaEvent)
    {
        Console.WriteLine($"Ny händelse: {stravaEvent.AspectType} för objekt {stravaEvent.ObjectId}");

        if (stravaEvent.ObjectType == "activity" && (stravaEvent.AspectType == "create" || stravaEvent.AspectType == "update"))
        {
            var serviceProvider = HttpContext.RequestServices;
            
            _ = Task.Run(async () => {
                try 
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var scopedStravaService = scope.ServiceProvider.GetRequiredService<IStravaService>();
                        
                        Console.WriteLine($"[BACKGROUND] Startar bearbetning av aktivitet: {stravaEvent.ObjectId}");
                        await scopedStravaService.ProcessActivityAsync(stravaEvent.ObjectId, stravaEvent.OwnerId.ToString());
                        Console.WriteLine($"[BACKGROUND] KLART! Aktivitet {stravaEvent.ObjectId} har sparats/bearbetats.");
                    }
                }
                catch (Exception ex) 
                {
                    // Detta fångar upp kraschen och skriver ut den med röd text i din dotnet-konsol!
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"[CRITICAL ERROR] Fel i Strava-bakgrundstråden: {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    }
                    Console.ResetColor();
                }
            });
        }

        return Ok();
    }
}

public class StravaWebhookEvent
{
    [JsonPropertyName("object_type")]
    public string ObjectType { get; set; } = "";
    
    [JsonPropertyName("object_id")]
    public long ObjectId { get; set; }
    
    [JsonPropertyName("aspect_type")]
    public string AspectType { get; set; } = "";
    
    [JsonPropertyName("owner_id")]
    public long OwnerId { get; set; }
}
