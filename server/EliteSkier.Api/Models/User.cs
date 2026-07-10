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
    public string Role { get; set; } = "atlet"; // DB-constraint users_role_check tillåter "atlet"/"coach"
    [Column("coach_id")]
    public int? CoachId { get; set; }
    [Column("entra_object_id")]
    public string? EntraObjectId { get; set; }
}