using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace EliteSkier.Api.Models;

[Table("workout_sessions")]
public class WorkoutSession
{
   [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("activity_id")]
    public int ActivityId { get; set; }

    [Column("template_id")]
    public int? TemplateId { get; set; }

    [Column("scheduled_date")] // Matchar scheduled_date
    public DateTime ScheduledDate { get; set; }

    [Column("time_of_day")]
    public string? TimeOfDay { get; set; }

    [Column("is_logged")]
    public bool IsLogged { get; set; }

    [Column("comment")] // Planerad kommentar
    public string? Comment { get; set; }

    [Column("logged_comment")] // Kommentar efter passet
    public string? LoggedComment { get; set; }

    [Column("physical_rpe")] // Hur det kändes (Feeling)
    public int? PhysicalRpe { get; set; }

    [Column("mental_rpe")]
    public int? MentalRpe { get; set; }

    // Planerade + faktiska pulszoner, en rad per zon/kind i workout_session_zones
    public ICollection<WorkoutSessionZone> Zones { get; set; } = new List<WorkoutSessionZone>();

    // --- ÖVRIGT (Från din SELECT) ---
    [Column("external_id")]
    public string? ExternalId { get; set; }

[Column("strava_raw", TypeName = "jsonb")]
    public string? StravaRaw { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("avg_heart_rate")]
    public int? AvgHeartRate { get; set; }


} 