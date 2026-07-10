using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;

[Table("workout_session_zones")]
public class WorkoutSessionZone
{
    [Column("workout_session_id")]
    public int WorkoutSessionId { get; set; }

    [Column("zone")]
    public string Zone { get; set; } = null!;

    [Column("kind")]
    public string Kind { get; set; } = null!; // "planned" | "actual"

    [Column("minutes")]
    public int Minutes { get; set; }
}
