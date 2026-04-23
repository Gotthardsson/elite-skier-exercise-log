using EliteSkier.Api.DTOs;

namespace EliteSkier.Api.Services;

public interface IAthleteService
{
    Task<IEnumerable<AthleteDto>> GetAllAthletesAsync();
    Task<AthleteDto> CreateAthleteAsync(AthleteDto athleteDto);
}