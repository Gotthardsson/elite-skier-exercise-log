using EliteSkier.Api.Models;

namespace EliteSkier.Api.Services;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutTemplate>> GetTemplatesAsync();
    Task<WorkoutTemplate> CreateTemplateAsync(WorkoutTemplate template);
}