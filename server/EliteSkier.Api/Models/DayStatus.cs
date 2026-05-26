using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;
[Table("day_status")]
public class DayStatus
{
    [Column ("id")]
    public int Id { get; set; }

    [Column ("sick")]
    public bool Sick { get; set; }

    [Column ("injured")]
    public bool Injured { get; set; }

    [Column ("day")]
    public DateTime Day { get; set; }

    [Column ("resting_heart_rate")]
    public int RestingHeartRate { get; set; }


    [Column ("hrv")]
    public int Hrv { get; set; }


    [Column ("rest_day")]
    public bool RestDay { get; set; }

     [Column ("travel_day")]
    public bool TravelDay { get; set; }
}