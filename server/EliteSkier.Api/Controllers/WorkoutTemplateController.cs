using Microsoft.AspNetCore.Mvc;
using EliteSkier.Api.Models;
using EliteSkier.Api.Services;

namespace EliteSkier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutTemplateController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutTemplateController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _workoutService.GetTemplatesAsync());

    [HttpPost]
    public async Task<IActionResult> Create(WorkoutTemplate template) => 
        Ok(await _workoutService.CreateTemplateAsync(template));
}