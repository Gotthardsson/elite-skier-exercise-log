using System.ComponentModel.DataAnnotations;

namespace EliteSkier.Api.Models;

public class Athlete
{
    [Key]
    public int Id { get; set; }
    
    public string Name { get; set; } = "";
    
    public string Club { get; set; } = "";
}