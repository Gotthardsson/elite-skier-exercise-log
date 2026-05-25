using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models; // För att hitta User/Folder
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    public UserRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.OrderBy(u => u.Name).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetByCoachIdAsync(int coachId)
    {
        return await _context.Users.Where(u => u.CoachId == coachId).OrderBy(u => u.Name).ToListAsync();
    }
}