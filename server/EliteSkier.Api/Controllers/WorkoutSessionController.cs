using EliteSkier.Api.Dtos;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutSessionsController : ControllerBase
{
    private readonly IWorkoutSessionService _workoutSessionService;

    public WorkoutSessionsController(IWorkoutSessionService workoutSessionService)
    {
        _workoutSessionService = workoutSessionService;
    }

    // GET: api/workoutsessions/user/1
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<WorkoutSessionDto>>> GetUserSessions(int userId)
    {
        var sessions = await _workoutSessionService.GetUserSessionsAsync(userId);
        return Ok(sessions);
    }

    // POST: api/workoutsessions
    [HttpPost]
    public async Task<ActionResult<WorkoutSessionDto>> CreateSession([FromBody] WorkoutSessionDto sessionDto)
    {
        if (sessionDto == null)
        {
            return BadRequest("Session data is missing.");
        }

        try
        {
            // Vi hårdkodar UserId till 1 för nu, tills du har ett inloggningssystem
            sessionDto.UserId = 1; 
            
            var createdSession = await _workoutSessionService.CreateSessionAsync(sessionDto);
            
            // Returnera 201 Created och den nyskapade sessionen
            return CreatedAtAction(nameof(GetUserSessions), new { userId = createdSession.UserId }, createdSession);
        }
        catch (Exception ex)
        {
            // Logga felet (man kan injicera en ILogger om man vill)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}