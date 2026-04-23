using Microsoft.EntityFrameworkCore;
using EliteSkier.Api.Data;
var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 1. LÄGG TILL DETTA: Registrera tjänster för Controllers
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Dependency Injection
builder.Services.AddScoped<IAthleteRepository, AthleteRepository>();
builder.Services.AddScoped<IAthleteService, AthleteService>();

var app = builder.Build();

// 2. LÄGG TILL DETTA: Aktivera routingen för dina Controllers
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();




app.Run();