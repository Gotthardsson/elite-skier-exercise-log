using EliteSkier.Api.Dtos;

namespace EliteSkier.Api.Services;

public interface IWorkoutSessionService
{
    Task<IEnumerable<WorkoutSessionDto>> GetUserSessionsAsync(int userId);
    Task<WorkoutSessionDto> CreateSessionAsync(WorkoutSessionDto dto);
    // Vi kan lägga till Update och Delete här sen
}