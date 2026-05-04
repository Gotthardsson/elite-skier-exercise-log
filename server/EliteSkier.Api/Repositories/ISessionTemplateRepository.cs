using EliteSkier.Api.Models;
namespace EliteSkier.Api.Repositories;
public interface ISessionTemplateRepository
{
    Task<SessionTemplate?> GetByIdAsync(int id);
    Task<IEnumerable<SessionTemplate>> GetAllByUserIdAsync(int userId);
    Task<SessionTemplate> AddAsync(SessionTemplate template);
    Task UpdateAsync(SessionTemplate template);
    Task DeleteAsync(int id);
}