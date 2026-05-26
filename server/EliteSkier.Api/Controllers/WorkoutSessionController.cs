using System.Security.Cryptography.X509Certificates;
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


    // DELETE: api/WorkoutSession/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        try
        {
         bool result = await _workoutSessionService.DeleteSessionAsync(id);
         return Ok(new{ message = "Passet har raderats"});

        }
        catch (Exception ex)
        {
            
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }

    }

    [HttpPut("{id}")]
    public async Task <IActionResult> UpdateSession(int id, [FromBody] WorkoutSessionDto dto)
    {
        if (dto == null)
        {
            return BadRequest("Template data is missing.");
        }

        if(id != dto.Id)
        {
            return BadRequest("ID i URL matchar inte ID i bodyn.");
        }

        try
        {
           await _workoutSessionService.UpdateSessionAsync(dto);
           return Ok(new{ message = "Passet har ändrats"});
        }
        catch(Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        
    }

     



  





}