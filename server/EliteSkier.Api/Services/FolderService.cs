using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;
public class FolderService : IFolderService
{
    private readonly IFolderRepository _folderRepository;
    private readonly ICurrentUserService _currentUserService;

    public FolderService(IFolderRepository folderRepository, ICurrentUserService currentUserService)
    {
        _folderRepository = folderRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<Folder>> GetFoldersByUserIdAsync(int userId)
    {
        if (!await _currentUserService.CanAccessUserAsync(userId))
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att se dessa mappar.");
        }

        return await _folderRepository.GetByUserIdAsync(userId);
    }
    public async Task<IEnumerable<Folder>> GetAllFoldersAsync()
    {
        // Här kan du lägga till logik om det behövs i framtiden
        return await _folderRepository.GetAllAsync();
    }

    public async Task<Folder> CreateFolderAsync(Folder folder)
    {
        if (!await _currentUserService.CanAccessUserAsync(folder.UserId))
        {
            throw new UnauthorizedAccessException("Du kan inte skapa en mapp för denna användare.");
        }

        return await _folderRepository.CreateAsync(folder);
    }
}

    