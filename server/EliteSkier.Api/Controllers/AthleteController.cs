[ApiController]
[Route("api/[controller]")]
public class AthleteController : ControllerBase
{
    private readonly IAthleteService _athleteService;

    public AthleteController(IAthleteService athleteService) => _athleteService = athleteService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _athleteService.GetAllAthletesAsync());

    [HttpPost]
    public async Task<IActionResult> Create(AthleteDto dto) => Ok(await _athleteService.CreateAthleteAsync(dto));
}