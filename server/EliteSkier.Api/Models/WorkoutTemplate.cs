namespace EliteSkier.Api.Models;

public class WorkoutTemplate
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // Mallnamn
    public string Folder { get; set; } = string.Empty; // Mapp
    public string Sport { get; set; } = string.Empty; // Sport
    public string? Description { get; set; } // Beskrivning (optional)
    
    // Intensitetszoner (lagras förslagsvis i minuter)
    public int MinutesA1 { get; set; }
    public int MinutesA2 { get; set; }
    public int MinutesA3Minus { get; set; }
    public int MinutesA3 { get; set; }
    public int MinutesA3Plus { get; set; }
    public int MinutesComp { get; set; }

    public bool IsInterval { get; set; } // Intervallpass-checkbox
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}