using EliteSkier.Api.Dtos;
namespace EliteSkier.Api.Services;
public interface ISessionTemplateService
{
    Task<IEnumerable<SessionTemplateDto>> GetUserTemplatesAsync(int userId);
    Task<SessionTemplateDto> CreateTemplateAsync(SessionTemplateDto dto);
    // Vi kan lägga till Update och Delete här sen
}