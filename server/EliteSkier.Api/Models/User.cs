using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;
[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    [Column("full_name")]
    public string Name { get; set; } = string.Empty;
    [Column("email")]
    public string Email { get; set; } = string.Empty;
    [Column("role")]
    public string Role { get; set; } = "athlete"; // Default to "athlete"
    [Column("coach_id")]
    public int CoachId { get; set; }
}