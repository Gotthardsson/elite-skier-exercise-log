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

    // --- PLANNED ZONES ---
    [Column("tiz_a1_planned")]
    public int TizA1Planned { get; set; }

    [Column("tiz_a2_planned")]
    public int TizA2Planned { get; set; }

    [Column("tiz_a3_minus_planned")]
    public int TizA3MinusPlanned { get; set; }

    [Column("tiz_a3_planned")]
    public int TizA3Planned { get; set; }

    [Column("tiz_a3_plus_planned")]
    public int TizA3PlusPlanned { get; set; }

    [Column("tiz_comp_planned")]
    public int TizCompPlanned { get; set; }

    // --- ACTUAL ZONES ---
    [Column("tiz_a1_actual")]
    public int TizA1Actual { get; set; }

    [Column("tiz_a2_actual")]
    public int TizA2Actual { get; set; }

    [Column("tiz_a3_minus_actual")]
    public int TizA3MinusActual { get; set; }

    [Column("tiz_a3_actual")]
    public int TizA3Actual { get; set; }

    [Column("tiz_a3_plus_actual")]
    public int TizA3PlusActual { get; set; }

    [Column("tiz_comp_actual")]
    public int TizCompActual { get; set; }

    // --- ÖVRIGT (Från din SELECT) ---
    [Column("external_id")]
    public string? ExternalId { get; set; }

    [Column("strava_raw")]
    public string? StravaRaw { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


} 