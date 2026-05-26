namespace EliteSkier.Api.Dtos;

public class DayStatusDto
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public bool Sick { get; set; }


    public bool Injured { get; set; }

  
    public DateTime Day { get; set; }

    public int RestingHeartRate { get; set; }
    public int Hrv { get; set; }

    public bool RestDay { get; set; }

    public bool TravelDay { get; set; }
    
}