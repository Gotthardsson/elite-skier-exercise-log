using System.ComponentModel.DataAnnotations;

namespace EliteSkier.Api.Dtos;

public class WorkoutSessionDto
{
    // Grundinfo
    public int? Id { get; set; } // Null vid nyskapande
    public DateTime ScheduledDate { get; set; }
    public string? TimeOfDay { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "ActivityId måste anges.")]
    public int ActivityId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "UserId måste anges.")]
    public int UserId { get; set; }
    public bool IsLogged { get; set; }

    public string? StravaRaw {get ; set;}

    // Kommentarer
    public string? Comment { get; set; } // Planerad
    public string? LoggedComment { get; set; } // Utförd

    // Ansträngning (Feeling)
    [Range(1, 10)]
    public int? PhysicalRpe { get; set; }

    [Range(1, 10)]
    public int? MentalRpe { get; set; }

    // Här använder vi objektet ZoneDto för att slippa 12 olika fält i frontenden
    public ZoneDto PlannedZones { get; set; } = new();
    public ZoneDto ActualZones { get; set; } = new();
    public int? AvgHeartRate { get; set; }
}

public class ZoneDto
{
    public int A1 { get; set; }
    public int A2 { get; set; }
    public int A3Minus { get; set; }
    public int A3 { get; set; }
    public int A3Plus { get; set; }
    public int Comp { get; set; }
}