using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models; // För att hitta Folder

namespace EliteSkier.Api.Repositories;
public interface IFolderRepository
{
    Task<IEnumerable<Folder>> GetAllAsync();
    Task<IEnumerable<Folder>> GetByUserIdAsync(int userId);
    Task<Folder> CreateAsync(Folder folder);
}