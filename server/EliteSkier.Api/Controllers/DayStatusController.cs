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
    public async Task<IActionResult> GetByDate([FromQuery] DateTime date)
    {
        var status = await _service.GetStatusByDateAsync(date);
        
        // Returnera 200 OK med data, eller 204 No Content om dagen inte har loggats än
        if (status == null) return NoContent(); 
        
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
    public async Task<IActionResult> GetAllStatuses()
    {
        var statuses = await _service.GetAllStatusesAsync();
    
    return Ok(statuses);
    }
}