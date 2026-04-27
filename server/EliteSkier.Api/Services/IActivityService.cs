using EliteSkier.Api.Repositories;
using EliteSkier.Api.Models;
namespace EliteSkier.Api.Services;

public interface IActivityService
{
    Task<IEnumerable<Activity>> GetAllActivitiesAsync();
}