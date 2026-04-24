using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EliteSkier.Api.Data;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AthleteController : ControllerBase
{
    private readonly AppDbContext _context;

    public AthleteController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get() 
    {
        var data = await _context.Athletes.ToListAsync();
        return Ok(data);
    }
}