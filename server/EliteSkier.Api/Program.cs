var builder = WebApplication.CreateBuilder(args);

// 1. LÄGG TILL DETTA: Registrera tjänster för Controllers
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// 2. LÄGG TILL DETTA: Aktivera routingen för dina Controllers
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Kommentera bort denna tillfälligt för att underlätta för ngrok
// app.UseHttpsRedirection();

// Behåll väder-exemplet om du vill, men det behövs inte för Strava
app.MapGet("/weatherforecast", () => { /* ... */ });

app.Run();