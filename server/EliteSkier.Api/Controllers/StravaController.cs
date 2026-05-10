using Microsoft.AspNetCore.Mvc;
using EliteSkier.Api.Services;

[ApiController]
[Route("api/[controller]")]
public class StravaController : ControllerBase
{
    private readonly IStravaService _stravaService;

    public StravaController(IStravaService stravaService)
    {
        _stravaService = stravaService;
    }

    [HttpPost("exchange-token")]
    public async Task<IActionResult> ExchangeToken([FromBody] StravaExchangeRequest request)
    {
        // TODO: Hämta riktigt UserId från din Auth-token/Session
        var userId = 1; 

        var success = await _stravaService.ExchangeCodeAndSaveAsync(userId, request.Code);
        
        if (success) return Ok(new { message = "Kopplingen lyckades!" });
        return BadRequest("Misslyckades att byta kod mot tokens.");
    }
}

public class StravaExchangeRequest { public string Code { get; set; } = ""; }