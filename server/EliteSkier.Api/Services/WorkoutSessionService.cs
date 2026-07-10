using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public class WorkoutSessionService : IWorkoutSessionService
{
    private readonly IWorkoutSessionRepository _repo;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutSessionService(IWorkoutSessionRepository repo, ICurrentUserService currentUserService)
    {
        _repo = repo;
        _currentUserService = currentUserService;
    }

    public async Task<WorkoutSessionDto> CreateSessionAsync(WorkoutSessionDto dto)
    {
        if (!await _currentUserService.CanAccessUserAsync(dto.UserId))
        {
            throw new UnauthorizedAccessException("Du kan inte skapa pass för denna användare.");
        }

        // 1. Mappa DTO -> Model
        var session = new WorkoutSession
        {
            UserId = dto.UserId,
            ActivityId = dto.ActivityId,
            ScheduledDate = dto.ScheduledDate,
            TimeOfDay = dto.TimeOfDay,
            IsLogged = dto.IsLogged,
            Comment = dto.Comment,
            LoggedComment = dto.LoggedComment,
            PhysicalRpe = dto.PhysicalRpe,
            MentalRpe = dto.MentalRpe,
            AvgHeartRate = dto.AvgHeartRate,
        };

        // Mappa zoner (planerade + faktiska) till de normaliserade zon-raderna
        foreach (var zone in ZoneMapping.ToWorkoutSessionZoneRows(0, dto.PlannedZones, "planned"))
        {
            session.Zones.Add(zone);
        }
        foreach (var zone in ZoneMapping.ToWorkoutSessionZoneRows(0, dto.ActualZones, "actual"))
        {
            session.Zones.Add(zone);
        }

        // 2. Spara via Repo
        var createdSession = await _repo.AddAsync(session);

        // 3. Returnera DTO (här kan man använda AutoMapper senare, men manuellt funkar nu)
        dto.Id = createdSession.Id;
        return dto;
    }
    public async Task<IEnumerable<WorkoutSessionDto>> GetUserSessionsAsync(int userId)
    {
    if (!await _currentUserService.CanAccessUserAsync(userId))
    {
        throw new UnauthorizedAccessException("Du har inte behörighet att se dessa pass.");
    }

    var sessions = await _repo.GetAllByUserIdAsync(userId);

    return sessions.Select(s => new WorkoutSessionDto
    {
        Id = s.Id,
        UserId = s.UserId,
        ActivityId = s.ActivityId,
        ScheduledDate = s.ScheduledDate,
        TimeOfDay = s.TimeOfDay,
        IsLogged = s.IsLogged,
        StravaRaw = s.StravaRaw,

        Comment = s.Comment,
        LoggedComment = s.LoggedComment,
        PhysicalRpe = s.PhysicalRpe,
        MentalRpe = s.MentalRpe,
        AvgHeartRate = s.AvgHeartRate,

        PlannedZones = ZoneMapping.ToZoneDto(s.Zones, "planned"),
        ActualZones = ZoneMapping.ToZoneDto(s.Zones, "actual")
    });
}

    public async Task<bool> DeleteSessionAsync(int id)
    {
        var session = await _repo.GetByIdAsync(id);
        if (session == null)
        {
            return false;
        }

        if (!await _currentUserService.CanAccessUserAsync(session.UserId))
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att radera detta pass.");
        }

        return await _repo.DeleteAsync(id);
    }


    public async Task UpdateSessionAsync (WorkoutSessionDto dto)
    {

       // 1. Hämta det befintliga passet från databasen med ID:t från DTO:n
    var existingSession = await _repo.GetByIdAsync(dto.Id??0);

    if (existingSession == null)
    {
        throw new Exception($"Passet med ID {dto.Id} hittades inte i databasen.");
    }

    if (!await _currentUserService.CanAccessUserAsync(existingSession.UserId))
    {
        throw new UnauthorizedAccessException("Du har inte behörighet att ändra detta pass.");
    }

    // 2. Uppdatera fälten på det existerande objektet
    existingSession.ActivityId = dto.ActivityId;
    existingSession.ScheduledDate = dto.ScheduledDate;
    existingSession.TimeOfDay = dto.TimeOfDay;
    existingSession.IsLogged = dto.IsLogged;
    existingSession.Comment = dto.Comment;
    existingSession.LoggedComment = dto.LoggedComment;
    existingSession.PhysicalRpe = dto.PhysicalRpe;
    existingSession.MentalRpe = dto.MentalRpe;
    existingSession.AvgHeartRate = dto.AvgHeartRate;

    // Byt ut zon-raderna (enklare och säkrare än att diffa rad för rad)
    existingSession.Zones.Clear();
    foreach (var zone in ZoneMapping.ToWorkoutSessionZoneRows(existingSession.Id, dto.PlannedZones, "planned"))
    {
        existingSession.Zones.Add(zone);
    }
    foreach (var zone in ZoneMapping.ToWorkoutSessionZoneRows(existingSession.Id, dto.ActualZones, "actual"))
    {
        existingSession.Zones.Add(zone);
    }

    // 3. Spara ändringarna via repositoryt
    await _repo.UpdateAsync(existingSession);
    }


}
