using Microsoft.EntityFrameworkCore;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet <Activity> Activities {get; set;}
    public DbSet<WorkoutSession> WorkoutSessions { get; set; }
    public DbSet<SessionTemplate> SessionTemplates { get; set; }
    public DbSet<Folder> Folders { get; set; }
    public DbSet<StravaIntegration> StravaIntegrations { get; set; }

    public DbSet <HeartRateZones> HeartRateZones {get; set;}
  
    public DbSet <DayStatus> DayStatus {get; set;}


    protected override void OnModelCreating (ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<WorkoutSession>()
        .Property(b => b.StravaRaw)
        .HasColumnType("jsonb"); // Explicit mappning för PostgreSQL
    }

}