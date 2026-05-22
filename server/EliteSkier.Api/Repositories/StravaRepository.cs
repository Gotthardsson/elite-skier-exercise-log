using Microsoft.EntityFrameworkCore;
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

    // Sparar eller uppdaterar tokens för en användare
    public async Task UpsertIntegrationAsync(StravaIntegration integration)
    {
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

    // Hittar integrationen baserat på vår interna UserId
    public async Task<StravaIntegration?> GetByUserIdAsync(int userId)
    {
        return await _context.StravaIntegrations
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    // VIKTIGAST FÖR WEBHOOKEN: Hittar integrationen via Stravas id
    public async Task<StravaIntegration?> GetByStravaAthleteIdAsync(string athleteId)
    {
        return await _context.StravaIntegrations
            .FirstOrDefaultAsync(x => x.StravaAthleteId == athleteId);
    }
}