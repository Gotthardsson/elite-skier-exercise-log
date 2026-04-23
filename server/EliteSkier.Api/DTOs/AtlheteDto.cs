namespace EliteSkier.Api.DTOs;

public class AthleteDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Club { get; set; } = "";
    // Här kan vi lägga till fält som inte finns i databasen, t.ex. "DisplayName"
    public string FullInfo => $"{Name} ({Club})";
}