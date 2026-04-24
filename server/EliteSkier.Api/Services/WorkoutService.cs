using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _repository;

    public WorkoutService(IWorkoutRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<WorkoutTemplate>> GetTemplatesAsync() => 
        await _repository.GetAllAsync();

    public async Task<WorkoutTemplate> CreateTemplateAsync(WorkoutTemplate template) => 
        await _repository.AddAsync(template);
}