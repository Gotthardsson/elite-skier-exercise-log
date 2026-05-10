using EliteSkier.Api.Models; // Se till att denna rad finns!

namespace EliteSkier.Api.Repositories;

public interface IStravaRepository
{
    Task UpsertIntegrationAsync(StravaIntegration integration); 
    // ^ Denna StravaIntegration måste vara EliteSkier.Api.Models.StravaIntegration
}