using EliteSkier.Api.Data;
using EliteSkier.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Repositories;

public class WorkoutSessionRepository : IWorkoutSessionRepository
{
    private readonly AppDbContext _context;

    public WorkoutSessionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WorkoutSession?> GetByIdAsync(int id) => 
        await _context.WorkoutSessions.FindAsync(id);

    public async Task<IEnumerable<WorkoutSession>> GetAllByUserIdAsync(int userId) =>
        await _context.WorkoutSessions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.ScheduledDate)
            .ToListAsync();

    public async Task<WorkoutSession> AddAsync(WorkoutSession session)
    {
        _context.WorkoutSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task UpdateAsync(WorkoutSession session)
    {
        _context.Entry(session).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var session = await _context.WorkoutSessions.FindAsync(id);
        if (session != null)
        {
            _context.WorkoutSessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }
}