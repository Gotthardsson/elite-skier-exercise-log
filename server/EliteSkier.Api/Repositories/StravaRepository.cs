using Microsoft.EntityFrameworkCore; // VIKTIGT: För FirstOrDefaultAsync
using EliteSkier.Api.Data;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public class StravaRepository : IStravaRepository
{
    private readonly AppDbContext _context;

    public StravaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task UpsertIntegrationAsync(StravaIntegration integration)
    {
        // Se till att FirstOrDefaultAsync hittas via Microsoft.EntityFrameworkCore
        var existing = await _context.StravaIntegrations
            .FirstOrDefaultAsync(x => x.UserId == integration.UserId);

        if (existing != null)
        {
            existing.StravaRefreshToken = integration.StravaRefreshToken;
            existing.StravaAthleteId = integration.StravaAthleteId;
        }
        else
        {
            _context.StravaIntegrations.Add(integration);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<StravaIntegration?> GetByUserIdAsync(int userId)
    {
        // Här var felet troligen returtypen eller saknad await
        return await _context.StravaIntegrations
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }
}