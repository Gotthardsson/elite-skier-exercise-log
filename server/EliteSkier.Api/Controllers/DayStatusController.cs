using EliteSkier.Api.Dtos;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/day-status")]
[Authorize]
public class DayStatusController : ControllerBase
{
    private readonly IDayStatusService _service;

    public DayStatusController(IDayStatusService service)
    {
        _service = service;
    }

    // GET: api/day-status?date=2026-05-25
   [HttpGet]
    public async Task<IActionResult> GetByDate([FromQuery] DateTime date, [FromQuery] int userId)
    {
        try
        {
            var status = await _service.GetStatusByDateAsync(userId, date);
            return Ok(status);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // POST: api/day-status
    [HttpPost]
    public async Task<IActionResult> SaveStatus([FromBody] DayStatusDto dto)
    {
        if (dto == null) return BadRequest("Felaktig data.");

        try
        {
            var result = await _service.SaveStatusAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllStatuses([FromQuery] int userId)
    {
        try
        {
            var statuses = await _service.GetAllStatusesAsync(userId);
            return Ok(statuses);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}