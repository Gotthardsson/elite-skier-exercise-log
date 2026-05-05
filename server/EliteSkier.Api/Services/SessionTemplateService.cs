using System.Diagnostics;
using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;
namespace EliteSkier.Api.Services;
public class SessionTemplateService : ISessionTemplateService
{
    private readonly ISessionTemplateRepository _repository;

    public SessionTemplateService(ISessionTemplateRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SessionTemplateDto>> GetUserTemplatesAsync(int userId)
    {
        var templates = await _repository.GetAllByUserIdAsync(userId);
        return templates.Select(t => new SessionTemplateDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            CreatedAt = t.Created_at,
            CreatorId = t.Creator_id,
        });
    }

    public async Task<SessionTemplateDto> CreateTemplateAsync(SessionTemplateDto dto)
    {
        var template = new SessionTemplate
        {
            Id = dto.Id,
            Title = dto.Title,
            Activity_id = dto.ActivityId,
            Folder_id = dto.FolderId,
            Description = dto.Description,
            Is_interval = dto.IsInterval,
            Tiz_a1_planned = dto.PlannedZones.A1,
            Tiz_a2_planned = dto.PlannedZones.A2,
            Tiz_a3_minus_planned = dto.PlannedZones.A3Minus,
            Tiz_a3_planned = dto.PlannedZones.A3,
            Tiz_a3_plus_planned = dto.PlannedZones.A3Plus,
            Tiz_competition_planned = dto.PlannedZones.Comp,
            Creator_id = dto.CreatorId,
            Created_at = DateTime.UtcNow
        };
        var created = await _repository.AddAsync(template);
        return new SessionTemplateDto{
            Id = created.Id,
            CreatorId = created.Creator_id,
            Title = created.Title,
            ActivityId = created.Activity_id,
            FolderId = created.Folder_id,
            Description = created.Description,
            CreatedAt = created.Created_at,
            IsInterval = created.Is_interval,
            PlannedZones = new ZoneDto
            {
                A1 = created.Tiz_a1_planned,
                A2 = created.Tiz_a2_planned,
                A3Minus = created.Tiz_a3_minus_planned,
                A3 = created.Tiz_a3_planned,
                A3Plus = created.Tiz_a3_plus_planned,
                Comp = created.Tiz_competition_planned
            }
        };
        
    }
}