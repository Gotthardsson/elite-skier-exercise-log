namespace EliteSkier.Api.Dtos;
public class SessionTemplateDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ActivityId { get; set; }
    public int? FolderId { get; set; }
    public int CreatorId { get; set; }
    public bool IsInterval { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Description { get; set; }
    public ZoneDto PlannedZones { get; set; } = new();
}