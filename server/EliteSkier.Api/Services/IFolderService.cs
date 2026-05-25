using EliteSkier.Api.Repositories;
using EliteSkier.Api.Models;
namespace EliteSkier.Api.Services;
public interface IFolderService
{
    Task<IEnumerable<Folder>> GetAllFoldersAsync();
    Task<IEnumerable<Folder>> GetFoldersByUserIdAsync(int userId);
    Task<Folder> CreateFolderAsync(Folder folder);
}