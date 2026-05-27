using Microsoft.AspNetCore.Mvc;
using EliteSkier.Api.Services;

[ApiController]
[Route("api/[controller]")]
public class StravaController : ControllerBase
{
    private readonly IStravaService _stravaService;
    // Om du vill hämta användaren direkt via ApplicationDbContext i controllern:
    // private readonly ApplicationDbContext _context; 

    public StravaController(IStravaService stravaService)
    {
        _stravaService = stravaService;
    }

    [HttpPost("exchange-token")]
    public async Task<IActionResult> ExchangeToken([FromBody] StravaExchangeRequest request)
    {
        // TODO: Hämta riktigt UserId från din Auth-token/Session (t.ex. via User.FindFirst)
        var userId = 1; 

        var success = await _stravaService.ExchangeCodeAndSaveAsync(userId, request.Code);
        
        if (success) return Ok(new { message = "Kopplingen lyckades!" });
        return BadRequest("Misslyckades att byta kod mot tokens.");
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStravaStatus()
    {
        // 1. Hämta UserId (Just nu hårdkodat till 1, ändra när du har Auth på plats)
        var userId = 1; 

        // 2. Kolla om användaren har en koppling på riktigt i databasen.
        // Det bästa är om ditt _stravaService har en metod för detta, t.ex:
        bool isConnected = await _stravaService.HasActiveConnectionAsync(userId);

        /* OM du istället vill göra det direkt mot din DbContext här i controllern:
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();
        bool isConnected = !string.IsNullOrEmpty(user.StravaRefreshToken);
        */

        // 3. Svara frontenden med ett JSON-objekt
        return Ok(new { connected = isConnected });
    }

    [HttpPost("disconnect")]
    public async Task<IActionResult> DisconnectStrava()
    {
        var userId = 1; // TODO: Hämta riktigt UserId

        // Anropa servicen för att rensa Strava-tokens (sätta dem till null/empty i DB)
        var success = await _stravaService.DisconnectAsync(userId);

        if (success) return Ok(new { message = "Bortkopplad från Strava." });
        return BadRequest("Kunde inte koppla bort Strava.");
    }
}

public class StravaExchangeRequest { public string Code { get; set; } = ""; }