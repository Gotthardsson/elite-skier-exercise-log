using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public interface IAthleteRepository
{
    Task<IEnumerable<Athlete>> GetAllAsync();
    Task AddAsync(Athlete athlete);
}