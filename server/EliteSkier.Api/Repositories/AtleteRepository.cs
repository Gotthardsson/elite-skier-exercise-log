using EliteSkier.Api.Data;
using EliteSkier.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Repositories;

public class AthleteRepository : IAthleteRepository
{
    private readonly AppDbContext _context;
    public AthleteRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Athlete>> GetAllAsync() => await _context.Athletes.ToListAsync();
    
    public async Task AddAsync(Athlete athlete)
    {
        await _context.Athletes.AddAsync(athlete);
        await _context.SaveChangesAsync();
    }
}