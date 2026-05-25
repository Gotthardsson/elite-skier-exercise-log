using EliteSkier.Api.Data;   
using EliteSkier.Api.Models; 
using Microsoft.EntityFrameworkCore;
namespace EliteSkier.Api.Repositories;

public class FolderRepository : IFolderRepository
{
    private readonly AppDbContext _context;
    public FolderRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Folder>> GetByUserIdAsync(int userId)
    {
        return await _context.Folders.Where(f => f.UserId == userId).OrderBy(f => f.Name).ToListAsync();
    }

    public async Task<IEnumerable<Folder>> GetAllAsync()
    {
        return await _context.Folders.OrderBy(f => f.Name).ToListAsync();
    }

    public async Task<Folder> CreateAsync(Folder folder)
    {
        _context.Folders.Add(folder);
        await _context.SaveChangesAsync();
        return folder;
    }
}