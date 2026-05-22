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
                existingSession.TizA1Actual = session.TizA1Actual;
                existingSession.TizA2Actual = session.TizA2Actual;
                existingSession.TizA3MinusActual = session.TizA3MinusActual;
                existingSession.TizA3Actual = session.TizA3Actual;
                existingSession.TizA3PlusActual = session.TizA3PlusActual;
                existingSession.TizCompActual = session.TizCompActual;
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