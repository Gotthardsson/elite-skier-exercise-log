namespace EliteSkier.Api.Dtos;

public class WorkoutSessionDto
{
    // Grundinfo
    public int? Id { get; set; } // Null vid nyskapande
    public DateTime ScheduledDate { get; set; }
    public string? TimeOfDay { get; set; }
    public int ActivityId { get; set; }
    public int UserId { get; set; }
    public bool IsLogged { get; set; }

    // Kommentarer
    public string? Comment { get; set; } // Planerad
    public string? LoggedComment { get; set; } // Utförd

    // Ansträngning (Feeling)
    public int? PhysicalRpe { get; set; }
    public int? MentalRpe { get; set; }

    // Här använder vi objektet ZoneDto för att slippa 12 olika fält i frontenden
    public ZoneDto PlannedZones { get; set; } = new();
    public ZoneDto ActualZones { get; set; } = new();
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