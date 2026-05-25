using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models; // För att hitta Activity/User
using Microsoft.EntityFrameworkCore;
namespace EliteSkier.Api.Repositories;



public class UserHeartRateRepository : IUserHeartRateRepository
{
    private readonly AppDbContext _context;
    public UserHeartRateRepository(AppDbContext context)
    {
          _context = context;
    }
public async Task<HeartRateZones?> GetByUserIdAsync(int userId) => 
    await _context.HeartRateZones
        .Where(z => z.UserId == userId)
        .OrderByDescending(z => z.ValidFrom) // Tar de nyaste zonerna om det finns flera
        .FirstOrDefaultAsync();

}