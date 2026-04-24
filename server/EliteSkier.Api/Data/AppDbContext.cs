using Microsoft.EntityFrameworkCore;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Athlete> Athletes {get; set;}
    public DbSet<WorkoutTemplate> WorkoutTemplates { get; set; }


    protected override void OnModelCreating (ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

}