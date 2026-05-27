using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public interface IStravaRepository
{
    // Sparar eller uppdaterar en integration (Används vid parkoppling och token-rotering)
    Task UpsertIntegrationAsync(StravaIntegration integration);

    // Hämtar integrationen baserat på appens UserId (Används för att kolla status och vid bortkoppling)
    Task<StravaIntegration?> GetByIdAsync(int userId);

    // Hämtar integrationen baserat på Stravas interna ID (Används av din Webhook)
    Task<StravaIntegration?> GetByStravaAthleteIdAsync(string athleteId);
}