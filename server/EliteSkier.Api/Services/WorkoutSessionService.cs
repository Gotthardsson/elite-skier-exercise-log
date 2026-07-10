using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;
using Microsoft.Extensions.ObjectPool;

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
            MentalRpe =dto.MentalRpe,
            AvgHeartRate=dto.AvgHeartRate,
    
            
            // Mappa planerade zoner
            TizA1Planned = dto.PlannedZones.A1,
            TizA2Planned = dto.PlannedZones.A2,
            TizA3MinusPlanned = dto.PlannedZones.A3Minus,
            TizA3Planned = dto.PlannedZones.A3,
            TizA3PlusPlanned = dto.PlannedZones.A3Plus,
            TizCompPlanned = dto.PlannedZones.Comp,

            // Mappa faktiska zoner
            TizA1Actual = dto.ActualZones.A1,
            TizA2Actual = dto.ActualZones.A2,
            TizA3MinusActual = dto.ActualZones.A3Minus,
            TizA3Actual = dto.ActualZones.A3,
            TizA3PlusActual = dto.ActualZones.A3Plus,
            TizCompActual = dto.ActualZones.Comp
        };

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

        PlannedZones = new ZoneDto
        {
            A1 = s.TizA1Planned,
            A2 = s.TizA2Planned,
            A3Minus = s.TizA3MinusPlanned,
            A3 = s.TizA3Planned,
            A3Plus = s.TizA3PlusPlanned,
            Comp = s.TizCompPlanned
        },

        ActualZones = new ZoneDto
        {
            A1 = s.TizA1Actual,
            A2 = s.TizA2Actual,
            A3Minus = s.TizA3MinusActual,
            A3 = s.TizA3Actual,
            A3Plus = s.TizA3PlusActual,
            Comp = s.TizCompActual
        }
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

    // Uppdatera planerade zoner (Platta fält i modellen)
    existingSession.TizA1Planned = dto.PlannedZones?.A1 ?? 0;
    existingSession.TizA2Planned = dto.PlannedZones?.A2 ?? 0;
    existingSession.TizA3MinusPlanned = dto.PlannedZones?.A3Minus ?? 0;
    existingSession.TizA3Planned = dto.PlannedZones?.A3 ?? 0;
    existingSession.TizA3PlusPlanned = dto.PlannedZones?.A3Plus ?? 0;
    existingSession.TizCompPlanned = dto.PlannedZones?.Comp ?? 0;

    // Uppdatera faktiska zoner (Platta fält i modellen)
    existingSession.TizA1Actual = dto.ActualZones?.A1 ?? 0;
    existingSession.TizA2Actual = dto.ActualZones?.A2 ?? 0;
    existingSession.TizA3MinusActual = dto.ActualZones?.A3Minus ?? 0;
    existingSession.TizA3Actual = dto.ActualZones?.A3 ?? 0;
    existingSession.TizA3PlusActual = dto.ActualZones?.A3Plus ?? 0;
    existingSession.TizCompActual = dto.ActualZones?.Comp ?? 0;

    // 3. Spara ändringarna via repositoryt
    // EF Core kommer nu bara att generera SQL för de kolumner som faktiskt har ändrats
    await _repo.UpdateAsync(existingSession);
    }


}