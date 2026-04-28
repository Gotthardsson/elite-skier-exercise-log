using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Repositories;

namespace EliteSkier.Api.Services;

public class WorkoutSessionService : IWorkoutSessionService
{
    private readonly IWorkoutSessionRepository _repo;

    public WorkoutSessionService(IWorkoutSessionRepository repo)
    {
        _repo = repo;
    }

    public async Task<WorkoutSessionDto> CreateSessionAsync(WorkoutSessionDto dto)
    {
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
    var sessions = await _repo.GetAllByUserIdAsync(userId);

    return sessions.Select(s => new WorkoutSessionDto
    {
        Id = s.Id,
        UserId = s.UserId,
        ActivityId = s.ActivityId,
        ScheduledDate = s.ScheduledDate,
        TimeOfDay = s.TimeOfDay,
        IsLogged = s.IsLogged,

        Comment = s.Comment,
        LoggedComment = s.LoggedComment,
        PhysicalRpe = s.PhysicalRpe,
        MentalRpe = s.MentalRpe,

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
}