using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public interface IWorkoutRepository
{
    Task<IEnumerable<WorkoutTemplate>> GetAllAsync();
    Task<WorkoutTemplate> AddAsync(WorkoutTemplate template);
}