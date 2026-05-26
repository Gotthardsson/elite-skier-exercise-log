using Microsoft.EntityFrameworkCore;
using EliteSkier.Api.Data;
using EliteSkier.Api.Repositories;
using EliteSkier.Api.Services;
using EliteSkier.Api.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);
// I början av Program.cs
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
// 1. Inställningar & Databas
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. CORS - Registrera policyn (Viktigt för React!)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddHttpClient();

// Registrera Repository
builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
builder.Services.AddScoped<IWorkoutSessionRepository, WorkoutSessionRepository>();
builder.Services.AddScoped<ISessionTemplateRepository, SessionTemplateRepository>();
builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<IStravaRepository, StravaRepository>();
builder.Services.AddScoped<IUserHeartRateRepository, UserHeartRateRepository>();
builder.Services.AddScoped<IDayStatusRepository, DayStatusRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Registrera Service
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IWorkoutSessionService, WorkoutSessionService>();
builder.Services.AddScoped<ISessionTemplateService, SessionTemplateService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<IStravaService, StravaService>();
builder.Services.AddScoped<IHeartrateZoneService, HeartrateZoneService>();
builder.Services.AddScoped<IDayStatusService, DayStatusService>();
builder.Services.AddScoped<IUserService, UserService>();


// 4. API & Swagger dokumentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- MIDDLWARE PIPELINE (Ordningen här är kritisk!) ---

// 1. Utvecklingsmiljö
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Grundläggande säkerhet och nätverk
app.UseHttpsRedirection();

// 3. AKTIVERA CORS (Måste ligga före Authorization och MapControllers)
app.UseCors("AllowReactApp");

app.UseAuthorization();

// 4. Koppla ihop endpoints
app.MapControllers();

app.Run();