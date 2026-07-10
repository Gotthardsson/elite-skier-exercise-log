using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;

[Table("session_template_zones")]
public class SessionTemplateZone
{
    [Column("session_template_id")]
    public int SessionTemplateId { get; set; }

    [Column("zone")]
    public string Zone { get; set; } = null!;

    [Column("minutes")]
    public int Minutes { get; set; }
}
