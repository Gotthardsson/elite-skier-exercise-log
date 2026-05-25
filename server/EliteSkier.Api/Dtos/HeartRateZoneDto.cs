namespace EliteSkier.Api.Dtos;
public class HeartRateZoneDto
{
    
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime ValidFrom { get; set; }

    public int A1Max { get; set; }

    public int A2Max { get; set; }

    public int A3MinusMax { get; set; }

    public int A3Max { get; set; }

    public int A3PlusMax { get; set; }

    public int CompitionMax { get; set; }
    
    public DateTime CreatedAt { get; set; }
}