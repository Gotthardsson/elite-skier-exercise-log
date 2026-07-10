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

    public async Task UpsertStravaWorkoutAsync(WorkoutSession session)
    {
        // 1. Kolla om passet redan finns via Stravas ID (ExternalId)
        var existingSession = await _context.WorkoutSessions
            .Include(w => w.Zones)
            .FirstOrDefaultAsync(w => w.ExternalId == session.ExternalId);

        if (existingSession != null)
        {
            // 2. Om passet finns, uppdatera bara rådatan och eventuellt kommentar
            // men RÖR INTE IsLogged om användaren redan hunnit logga det.
            existingSession.StravaRaw = session.StravaRaw;

            if (!existingSession.IsLogged)
            {
                existingSession.Comment = session.Comment;
                existingSession.ScheduledDate = session.ScheduledDate;
                // Här kan du uppdatera fler fält som t.ex. ActivityId om Strava-typen ändras

                // Ersätt bara de faktiska zonerna, låt eventuella planerade vara orörda
                foreach (var old in existingSession.Zones.Where(z => z.Kind == "actual").ToList())
                {
                    existingSession.Zones.Remove(old);
                }
                foreach (var zone in session.Zones.Where(z => z.Kind == "actual"))
                {
                    existingSession.Zones.Add(zone);
                }
            }

            _context.WorkoutSessions.Update(existingSession);
        }
        else
        {
            // 3. Om det är ett helt nytt pass, lägg till det i kön för sparning
            await _context.WorkoutSessions.AddAsync(session);
        }

        // 4. Skicka ändringarna till databasen
        await _context.SaveChangesAsync();
    }

    public async Task<WorkoutSession?> GetByIdAsync(int id) =>
        await _context.WorkoutSessions
            .Include(s => s.Zones)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<IEnumerable<WorkoutSession>> GetAllByUserIdAsync(int userId) =>
        await _context.WorkoutSessions
            .Include(s => s.Zones)
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
       _context.WorkoutSessions.Update(session); 
       await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var session = await _context.WorkoutSessions.FindAsync(id);
        if (session != null)
        {
            _context.WorkoutSessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }



}