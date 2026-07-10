using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EliteSkier.Api.Services;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StravaController : ControllerBase
{
    private readonly IStravaService _stravaService;
    private readonly ICurrentUserService _currentUserService;

    public StravaController(IStravaService stravaService, ICurrentUserService currentUserService)
    {
        _stravaService = stravaService;
        _currentUserService = currentUserService;
    }

    [HttpPost("exchange-token")]
    public async Task<IActionResult> ExchangeToken([FromBody] StravaExchangeRequest request)
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();

        var success = await _stravaService.ExchangeCodeAndSaveAsync(currentUser.Id, request.Code);

        if (success) return Ok(new { message = "Kopplingen lyckades!" });
        return BadRequest("Misslyckades att byta kod mot tokens.");
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStravaStatus()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();

        bool isConnected = await _stravaService.HasActiveConnectionAsync(currentUser.Id);

        return Ok(new { connected = isConnected });
    }

    [HttpPost("disconnect")]
    public async Task<IActionResult> DisconnectStrava()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();

        var success = await _stravaService.DisconnectAsync(currentUser.Id);

        if (success) return Ok(new { message = "Bortkopplad från Strava." });
        return BadRequest("Kunde inte koppla bort Strava.");
    }
}

public class StravaExchangeRequest { public string Code { get; set; } = ""; }