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
            CreatedAt = t.CreatedAt,
            CreatorId = t.CreatorId,
            ActivityId = t.ActivityId,
            FolderId = t.FolderId,
            IsInterval = t.IsInterval,
            PlannedZones = new ZoneDto
            {
                A1 = t.Tiz_a1_planned,
                A2 = t.Tiz_a2_planned,
                A3Minus = t.Tiz_a3_minus_planned,
                A3 = t.Tiz_a3_planned,
                A3Plus = t.Tiz_a3_plus_planned,
                Comp = t.Tiz_competition_planned
            }
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
            Tiz_a1_planned = dto.PlannedZones.A1,
            Tiz_a2_planned = dto.PlannedZones.A2,
            Tiz_a3_minus_planned = dto.PlannedZones.A3Minus,
            Tiz_a3_planned = dto.PlannedZones.A3,
            Tiz_a3_plus_planned = dto.PlannedZones.A3Plus,
            Tiz_competition_planned = dto.PlannedZones.Comp,
            CreatorId = dto.CreatorId,
            CreatedAt = DateTime.UtcNow
        };
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
            PlannedZones = new ZoneDto
            {
                A1 = template.Tiz_a1_planned,
                A2 = template.Tiz_a2_planned,
                A3Minus = template.Tiz_a3_minus_planned,
                A3 = template.Tiz_a3_planned,
                A3Plus = template.Tiz_a3_plus_planned,
                Comp = template.Tiz_competition_planned
            }
        };
    }

    public async Task DeleteTemplateAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task UpdateTemplateAsync(SessionTemplateDto dto)
    {
        var template = await _repository.GetByIdAsync(dto.Id);
        if (template == null) throw new InvalidOperationException("Template not found");

        template.Title = dto.Title;
        template.Description = dto.Description;
        template.ActivityId = dto.ActivityId;
        template.FolderId = dto.FolderId;
        template.IsInterval = dto.IsInterval;
        template.Tiz_a1_planned = dto.PlannedZones.A1;
        template.Tiz_a2_planned = dto.PlannedZones.A2;
        template.Tiz_a3_minus_planned = dto.PlannedZones.A3Minus;
        template.Tiz_a3_planned = dto.PlannedZones.A3;
        template.Tiz_a3_plus_planned = dto.PlannedZones.A3Plus;
        template.Tiz_competition_planned = dto.PlannedZones.Comp;

        await _repository.UpdateAsync(template);
    }
}
