using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;

[Table("session_templates")] // Mappar klassen till rätt tabellnamn
public class SessionTemplate
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("creator_id")]
    public int CreatorId { get; set; }

    [Column("folder_id")]
    public int? FolderId { get; set; } // Nullable eftersom en mall inte måste ligga i en mapp

    [Column("activity_id")]
    public int ActivityId  { get; set; }

    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("is_interval")]
    public bool IsInterval { get; set; }

    // Planerade pulszoner, en rad per zon i session_template_zones
    public ICollection<SessionTemplateZone> Zones { get; set; } = new List<SessionTemplateZone>();

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}