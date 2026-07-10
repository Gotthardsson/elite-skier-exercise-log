using System.Security.Cryptography.X509Certificates;
using EliteSkier.Api.Dtos;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutSessionsController : ControllerBase
{
    private readonly IWorkoutSessionService _workoutSessionService;
    private readonly ILogger<WorkoutSessionsController> _logger;

    public WorkoutSessionsController(IWorkoutSessionService workoutSessionService, ILogger<WorkoutSessionsController> logger)
    {
        _workoutSessionService = workoutSessionService;
        _logger = logger;
    }

    // GET: api/workoutsessions/user/1
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<WorkoutSessionDto>>> GetUserSessions(int userId)
    {
        try
        {
            var sessions = await _workoutSessionService.GetUserSessionsAsync(userId);
            return Ok(sessions);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // POST: api/workoutsessions
    [HttpPost]
    public async Task<ActionResult<WorkoutSessionDto>> CreateSession([FromBody] WorkoutSessionDto sessionDto)
    {
        if (sessionDto == null || !ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var createdSession = await _workoutSessionService.CreateSessionAsync(sessionDto);

            // Returnera 201 Created och den nyskapade sessionen
            return CreatedAtAction(nameof(GetUserSessions), new { userId = createdSession.UserId }, createdSession);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create workout session");
            return StatusCode(500, "Internal server error.");
        }
    }


    // DELETE: api/WorkoutSession/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        try
        {
            bool result = await _workoutSessionService.DeleteSessionAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { message = "Passet har raderats" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete workout session {SessionId}", id);
            return StatusCode(500, "Internal server error.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSession(int id, [FromBody] WorkoutSessionDto dto)
    {
        if (dto == null || !ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != dto.Id)
        {
            return BadRequest("ID i URL matchar inte ID i bodyn.");
        }

        try
        {
            await _workoutSessionService.UpdateSessionAsync(dto);
            return Ok(new { message = "Passet har ändrats" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update workout session {SessionId}", id);
            return StatusCode(500, "Internal server error.");
        }
    }
}
