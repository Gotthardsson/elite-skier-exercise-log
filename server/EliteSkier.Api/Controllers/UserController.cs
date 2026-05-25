using EliteSkier.Api.Models;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // GET: api/user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    // GET: api/user/coach/1
    [HttpGet("coach/{coachId}")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsersByCoachId(int coachId)
    {
        var users = await _userService.GetByCoachIdAsync(coachId);
        return Ok(users);
    }
}