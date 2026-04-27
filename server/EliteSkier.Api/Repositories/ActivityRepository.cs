using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models; // För att hitta Activity/User
using Microsoft.EntityFrameworkCore;
namespace EliteSkier.Api.Repositories;


public class ActivityRepository : IActivityRepository
{
    private readonly AppDbContext _context;
    public ActivityRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Activity>> GetAllAsync()
    {
        return await _context.Activities.OrderBy(a => a.Name).ToListAsync();
    }
}