using EliteSkier.Api.Models;

namespace EliteSkier.Api.Repositories;

public interface IStravaRepository
{
    Task UpsertIntegrationAsync(StravaIntegration integration);
    Task<StravaIntegration?> GetByUserIdAsync(int userId);
    Task<StravaIntegration?> GetByStravaAthleteIdAsync(string athleteId);
}