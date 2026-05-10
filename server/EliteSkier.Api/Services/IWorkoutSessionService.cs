using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Services;

public interface IWorkoutSessionService
{
    Task<IEnumerable<WorkoutSessionDto>> GetUserSessionsAsync(int userId);
    Task<WorkoutSessionDto> CreateSessionAsync(WorkoutSessionDto sessionDtodto);
    // Vi kan lägga till Update och Delete här sen
    Task<bool> DeleteSessionAsync(int id);

    Task UpdateSessionAsync (WorkoutSessionDto sessionDto);
}