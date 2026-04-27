using System.ComponentModel.DataAnnotations.Schema;

namespace EliteSkier.Api.Models;
[Table("activities")]
public class Activity
{
  [Column("id")]
  public int Id { get; set; }  
  [Column("name")]
  public string Name { get; set; } = null!;
}