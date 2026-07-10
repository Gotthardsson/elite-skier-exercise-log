using EliteSkier.Api.Models;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ICurrentUserService _currentUserService;

    public UserController(IUserService userService, ICurrentUserService currentUserService)
    {
        _userService = userService;
        _currentUserService = currentUserService;
    }

    // GET: api/user/me
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUser>> GetMe()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();
        return Ok(currentUser);
    }

    // GET: api/user/coach/1 - listar en coachs egna atleter
    [HttpGet("coach/{coachId}")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsersByCoachId(int coachId)
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (currentUser.Id != coachId)
        {
            return Forbid();
        }

        var users = await _userService.GetByCoachIdAsync(coachId);
        return Ok(users);
    }
}