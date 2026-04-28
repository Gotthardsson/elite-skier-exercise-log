using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public interface IWorkoutSessionRepository
{
    Task<WorkoutSession?> GetByIdAsync(int id);
    Task<IEnumerable<WorkoutSession>> GetAllByUserIdAsync(int userId);
    Task<WorkoutSession> AddAsync(WorkoutSession session);
    Task UpdateAsync(WorkoutSession session);
    Task DeleteAsync(int id);
}