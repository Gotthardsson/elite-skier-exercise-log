using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;
public class FolderService : IFolderService
{
    private readonly IFolderRepository _folderRepository;
    public FolderService(IFolderRepository folderRepository) => _folderRepository = folderRepository;
    public async Task<IEnumerable<Folder>> GetFoldersByUserIdAsync(int userId)
    {
        // Här kan du lägga till logik om det behövs i framtiden
        return await _folderRepository.GetByUserIdAsync(userId);
    }
    public async Task<IEnumerable<Folder>> GetAllFoldersAsync()
    {
        // Här kan du lägga till logik om det behövs i framtiden
        return await _folderRepository.GetAllAsync();
    }

    public async Task<Folder> CreateFolderAsync(Folder folder)
    {
        // Här kan du lägga till validering eller annan logik innan skapandet
        return await _folderRepository.CreateAsync(folder);
    }
}

    