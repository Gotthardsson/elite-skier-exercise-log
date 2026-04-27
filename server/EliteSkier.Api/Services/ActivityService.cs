using EliteSkier.Api.Repositories;
using EliteSkier.Api.Models;
namespace EliteSkier.Api.Services;
public class ActivityService : IActivityService
{
    private readonly IActivityRepository _repo;
    public ActivityService(IActivityRepository repo) => _repo = repo;

    public async Task<IEnumerable<Activity>> GetAllActivitiesAsync()
    {
        // Här kan du lägga till logik om det behövs i framtiden
        return await _repo.GetAllAsync();
    }
}