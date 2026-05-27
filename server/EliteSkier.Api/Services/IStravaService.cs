using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public interface IStravaService
{
    // Första kopplingen av konto
    Task<bool> ExchangeCodeAndSaveAsync(int userId, string code);

    // Hantering av webhook-event (hämtar passet)
    Task ProcessActivityAsync(long stravaActivityId, string stravaOwnerId);

    // Hjälpmetod för att säkerställa giltig nyckel
    Task<string> GetValidAccessTokenAsync(StravaIntegration integration);

    // NYTT: Kontrollera om användaren har en aktiv koppling
    Task<bool> HasActiveConnectionAsync(int userId);

    // NYTT: Koppla bort användaren (rensa tokens i DB)
    Task<bool> DisconnectAsync(int userId);
}