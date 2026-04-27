using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using EliteSkier.Api.Data;
using EliteSkier.Api.Services;
using EliteSkier.Api.Models; // Behövs också för att se Activity-klassen

namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
    {
        var activities = await _activityService.GetAllActivitiesAsync();
        return Ok(activities);
    }
}
