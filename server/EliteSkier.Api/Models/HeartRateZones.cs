using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace EliteSkier.Api.Models;

[Table("user_heartrate_zones")]
public class HeartRateZones
{
    [Column ("id")]
    public int Id { get; set; }

    [Column ("user_id")]
    public int UserId { get; set; }

    [Column ("valid_from")]
    public DateTime ValidFrom { get; set; }

    [Column ("a1_max")]
    public int A1Max { get; set; }

    [Column ("a2_max")]
    public int A2Max { get; set; }

    [Column ("a3_minus_max")]
    public int A3MinusMax { get; set; }

    [Column ("a3_max")]
    public int A3Max { get; set; }

    [Column ("a3_plus_max")]
    public int A3PlusMax { get; set; }

    [Column ("competition_max")]
    public int? CompitionMax { get; set; }
    
    [Column ("created_at")]
    public DateTime CreatedAt { get; set; }
}
