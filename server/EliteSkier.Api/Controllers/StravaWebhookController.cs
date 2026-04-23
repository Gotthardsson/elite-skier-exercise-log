using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/strava/webhook")]
public class StravaWebhookController : ControllerBase
{
    private readonly string _verifyToken = "Test1";

    // 1. VALIDERING (GET) - För att registrera webhooken
    [HttpGet]
    public IActionResult Validate([FromQuery(Name = "hub.mode")] string mode,
                                  [FromQuery(Name = "hub.challenge")] string challenge,
                                  [FromQuery(Name = "hub.verify_token")] string token)
    {
        if (mode == "subscribe" && token == _verifyToken)
        {
            // Tvingar fram "hub.challenge" med punkt som Strava kräver
            var response = new Dictionary<string, string>
            {
                { "hub.challenge", challenge }
            };
            
            return Ok(response);
        }

        return Forbid();
    }

    // 2. MOTTAGNING AV DATA (POST) - Här landar träningspassen
    [HttpPost]
    public IActionResult ReceiveEvent([FromBody] StravaWebhookEvent stravaEvent)
    {
        // Strava kräver ett snabbt svar (200 OK)
        Console.WriteLine($"Ny händelse: {stravaEvent.AspectType} för objekt {stravaEvent.ObjectId}");

        if (stravaEvent.ObjectType == "activity" && stravaEvent.AspectType == "create")
        {
            // Logik för att hämta data kommer här senare
        }

        return Ok();
    }
}

// Hjälpklass för JSON-mappning
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