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

    // Pulszoner - Planerad tid i sekunder
    [Column("tiz_a1_planned")]
    public int Tiz_a1_planned { get; set; }

    [Column("tiz_a2_planned")]
    public int Tiz_a2_planned { get; set; }

    [Column("tiz_a3_minus_planned")]
    public int Tiz_a3_minus_planned { get; set; }

    [Column("tiz_a3_planned")]
    public int Tiz_a3_planned { get; set; }

    [Column("tiz_a3_plus_planned")]
    public int Tiz_a3_plus_planned { get; set; }

    [Column("tiz_competition_planned")]
    public int Tiz_competition_planned { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}