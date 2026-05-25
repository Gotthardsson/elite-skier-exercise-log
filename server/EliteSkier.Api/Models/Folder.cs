using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;

[Table("template_folders")]
public class Folder
{
    [Key]
    [Column("id")]
    public int Id { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("color")]
    public string? Color { get; set; }
}