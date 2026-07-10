using EliteSkier.Api.Models; // För att hitta User

namespace EliteSkier.Api.Repositories;
public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<IEnumerable<User>> GetByCoachIdAsync(int coachId);
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEntraObjectIdAsync(string entraObjectId);
    Task<User> AddAsync(User user);
}