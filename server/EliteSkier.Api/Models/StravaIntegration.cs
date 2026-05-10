using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;

[Table("strava_integration")] // Mappar klassen till tabellen
public class StravaIntegration
{
    [Key] // Berättar att detta är Primary Key
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    [Column("user_id")] // Mappar egenskapen till kolumnen user_id
    public int UserId { get; set; }

    [Column("strava_athlete_id")]
    public string StravaAthleteId { get; set; } = string.Empty;

    [Column("strava_refresh_token")]
    public string StravaRefreshToken { get; set; } = string.Empty;
}