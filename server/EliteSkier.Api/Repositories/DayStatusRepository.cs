using EliteSkier.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Data.Repositories;

public class DayStatusRepository : IDayStatusRepository
{
    private readonly AppDbContext _context;

    public DayStatusRepository(AppDbContext context)
    {
        _context = context;
    }

   public async Task<DayStatus?> GetByDateAsync(int userId, DateTime date)
    {
    return await _context.DayStatus
        .FirstOrDefaultAsync(x => x.UserId == userId && x.Day.Date == date.Date);
    }

   public async Task<DayStatus> UpsertAsync(DayStatus status)
    {
        var existing = await GetByDateAsync(status.UserId, status.Day);

        if (existing != null)
        {
            existing.Sick = status.Sick;
            existing.Injured = status.Injured;
            existing.RestingHeartRate = status.RestingHeartRate;
            existing.Hrv = status.Hrv;
            // LÄGG TILL DESSA TVÅ RADER HÄR:
            existing.RestDay = status.RestDay;
            existing.TravelDay = status.TravelDay;
            
            _context.DayStatus.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            await _context.DayStatus.AddAsync(status);
            await _context.SaveChangesAsync();
            return status;
        }
    }
    public async Task<List<DayStatus>> GetAllAsync(int userId)
    {   
    return await _context.DayStatus
        .Where(x => x.UserId == userId)
        .ToListAsync();
    }       
}