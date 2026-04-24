using EliteSkier.Api.Data;
using EliteSkier.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Repositories;

public class WorkoutRepository : IWorkoutRepository
{
    private readonly AppDbContext _context;

    public WorkoutRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WorkoutTemplate>> GetAllAsync() => 
        await _context.WorkoutTemplates.ToListAsync();

    public async Task<WorkoutTemplate> AddAsync(WorkoutTemplate template)
    {
        _context.WorkoutTemplates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }
}