using EliteSkier.Api.DTOs;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public class AthleteService : IAthleteService
{
    private readonly IAthleteRepository _repository;

    public AthleteService(IAthleteRepository repository) => _repository = repository;

    public async Task<IEnumerable<AthleteDto>> GetAllAthletesAsync()
    {
        var athletes = await _repository.GetAllAsync();
        // Här mappar vi från Model -> DTO
        return athletes.Select(a => new AthleteDto { Id = a.Id, Name = a.Name, Club = a.Club });
    }

    public async Task<AthleteDto> CreateAthleteAsync(AthleteDto dto)
    {
        var athlete = new Athlete { Name = dto.Name, Club = dto.Club };
        await _repository.AddAsync(athlete);
        dto.Id = athlete.Id;
        return dto;
    }
}