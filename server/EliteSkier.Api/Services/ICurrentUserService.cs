namespace EliteSkier.Api.Services;

public record CurrentUser(int Id, string Role, int? CoachId);

public interface ICurrentUserService
{
    // Slår upp den inloggade Entra-identiteten mot en lokal User-rad.
    // Skapar en ny User första gången en identitet loggar in (JIT-provisionering).
    Task<CurrentUser> GetCurrentUserAsync();

    // True om den inloggade användaren är targetUserId, eller är dennes coach.
    Task<bool> CanAccessUserAsync(int targetUserId);
}
