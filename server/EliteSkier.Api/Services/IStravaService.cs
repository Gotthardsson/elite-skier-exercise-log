using System.Threading.Tasks;

namespace EliteSkier.Api.Services; // Måste vara EXAKT samma i båda filerna

public interface IStravaService
{
    Task<bool> ExchangeCodeAndSaveAsync(int userId, string code);
}