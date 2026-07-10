using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;
namespace EliteSkier.Api.Services;
public class SessionTemplateService : ISessionTemplateService
{
    private readonly ISessionTemplateRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public SessionTemplateService(ISessionTemplateRepository repository, ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<SessionTemplateDto>> GetUserTemplatesAsync(int userId)
    {
        if (!await _currentUserService.CanAccessUserAsync(userId))
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att se dessa mallar.");
        }

        var templates = await _repository.GetAllByUserIdAsync(userId);
        return templates.Select(t => new SessionTemplateDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            CreatedAt = t.CreatedAt,
            CreatorId = t.CreatorId,
            ActivityId = t.ActivityId,
            FolderId = t.FolderId,
            IsInterval = t.IsInterval,
            PlannedZones = ZoneMapping.ToZoneDto(t.Zones)
        });
    }

    public async Task<SessionTemplateDto> CreateTemplateAsync(SessionTemplateDto dto)
    {
        var template = new SessionTemplate
        {
            Id = dto.Id,
            Title = dto.Title,
            ActivityId = dto.ActivityId,
            FolderId = dto.FolderId,
            Description = dto.Description,
            IsInterval = dto.IsInterval,
            CreatorId = dto.CreatorId,
            CreatedAt = DateTime.UtcNow
        };
        foreach (var zone in ZoneMapping.ToSessionTemplateZoneRows(0, dto.PlannedZones))
        {
            template.Zones.Add(zone);
        }

        var created = await _repository.AddAsync(template);
        return new SessionTemplateDto{
            Id = created.Id,
            CreatorId = created.CreatorId,
            Title = created.Title,
            ActivityId = created.ActivityId,
            FolderId = created.FolderId,
            Description = created.Description,
            CreatedAt = created.CreatedAt,
            IsInterval = created.IsInterval,
            PlannedZones = ZoneMapping.ToZoneDto(created.Zones)
        };

    }

    public async Task<SessionTemplateDto> GetTemplateByIdAsync(int id)
    {
        var template = await _repository.GetByIdAsync(id);
        if (template == null) return null;

        return new SessionTemplateDto
        {
            Id = template.Id,
            Title = template.Title,
            Description = template.Description,
            CreatedAt = template.CreatedAt,
            CreatorId = template.CreatorId,
            ActivityId = template.ActivityId,
            FolderId = template.FolderId,
            IsInterval = template.IsInterval,
            PlannedZones = ZoneMapping.ToZoneDto(template.Zones)
        };
    }

    public async Task DeleteTemplateAsync(int id)
    {
        var template = await _repository.GetByIdAsync(id);
        if (template == null) return;

        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (template.CreatorId != currentUser.Id)
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att radera denna mall.");
        }

        await _repository.DeleteAsync(id);
    }

    public async Task UpdateTemplateAsync(SessionTemplateDto dto)
    {
        var template = await _repository.GetByIdAsync(dto.Id);
        if (template == null) throw new InvalidOperationException("Template not found");

        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (template.CreatorId != currentUser.Id)
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att ändra denna mall.");
        }

        template.Title = dto.Title;
        template.Description = dto.Description;
        template.ActivityId = dto.ActivityId;
        template.FolderId = dto.FolderId;
        template.IsInterval = dto.IsInterval;

        template.Zones.Clear();
        foreach (var zone in ZoneMapping.ToSessionTemplateZoneRows(template.Id, dto.PlannedZones))
        {
            template.Zones.Add(zone);
        }

        await _repository.UpdateAsync(template);
    }
}
