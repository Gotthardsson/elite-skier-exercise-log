using System.Security.Claims;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private const string ObjectIdClaimType = "http://schemas.microsoft.com/identity/claims/objectidentifier";

    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRepository _userRepository;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRepository = userRepository;
    }

    public async Task<CurrentUser> GetCurrentUserAsync()
    {
        var principal = _httpContextAccessor.HttpContext?.User
            ?? throw new InvalidOperationException("Ingen inloggad användare i denna kontext.");

        var objectId = principal.FindFirstValue(ObjectIdClaimType) ?? principal.FindFirstValue("oid");
        if (string.IsNullOrEmpty(objectId))
        {
            throw new UnauthorizedAccessException("Token saknar oid-claim.");
        }

        var user = await _userRepository.GetByEntraObjectIdAsync(objectId);
        if (user == null)
        {
            user = await _userRepository.AddAsync(new User
            {
                EntraObjectId = objectId,
                Email = principal.FindFirstValue(ClaimTypes.Email) ?? principal.FindFirstValue("emails") ?? string.Empty,
                Name = principal.FindFirstValue(ClaimTypes.Name) ?? principal.FindFirstValue("name") ?? string.Empty,
                Role = "atlet" // DB-constraint users_role_check tillåter bara "atlet"/"coach" (svensk stavning)
            });
        }

        return new CurrentUser(user.Id, user.Role, user.CoachId);
    }

    public async Task<bool> CanAccessUserAsync(int targetUserId)
    {
        var currentUser = await GetCurrentUserAsync();
        if (currentUser.Id == targetUserId)
        {
            return true;
        }

        if (currentUser.Role != "coach")
        {
            return false;
        }

        var target = await _userRepository.GetByIdAsync(targetUserId);
        return target != null && target.CoachId == currentUser.Id;
    }
}
