using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<IEnumerable<User>> GetByCoachIdAsync(int coachId);
}