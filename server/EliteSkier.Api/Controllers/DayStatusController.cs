using EliteSkier.Api.Dtos;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/day-status")]
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
        // Om userId skickas från frontend blir det automatiskt '1' här nu istället för hårdkodat!
        var status = await _service.GetStatusByDateAsync(userId, date);
        return Ok(status);
    }

    // POST: api/day-status
    [HttpPost]
    public async Task<IActionResult> SaveStatus([FromBody] DayStatusDto dto)
    {
        if (dto == null) return BadRequest("Felaktig data.");

        var result = await _service.SaveStatusAsync(dto);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllStatuses([FromQuery] int userId)
    {
        var statuses = await _service.GetAllStatusesAsync(userId);
        return Ok(statuses);
    }
}