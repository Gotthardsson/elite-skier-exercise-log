using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;

namespace EliteSkier.Api.Services;

// Pivoterar mellan de normaliserade zon-tabellerna (en rad per zon) och det platta
// ZoneDto-objektet som API:et/klienten redan använder.
public static class ZoneMapping
{
    private static readonly (string Zone, Func<ZoneDto, int> Get)[] ZoneAccessors =
    {
        ("a1", d => d.A1),
        ("a2", d => d.A2),
        ("a3_minus", d => d.A3Minus),
        ("a3", d => d.A3),
        ("a3_plus", d => d.A3Plus),
        ("comp", d => d.Comp),
    };

    public static ZoneDto ToZoneDto(IEnumerable<WorkoutSessionZone> zones, string kind)
    {
        var byZone = zones.Where(z => z.Kind == kind).ToDictionary(z => z.Zone, z => z.Minutes);
        return FromLookup(byZone);
    }

    public static ZoneDto ToZoneDto(IEnumerable<SessionTemplateZone> zones)
    {
        var byZone = zones.ToDictionary(z => z.Zone, z => z.Minutes);
        return FromLookup(byZone);
    }

    public static List<WorkoutSessionZone> ToWorkoutSessionZoneRows(int workoutSessionId, ZoneDto? dto, string kind)
    {
        dto ??= new ZoneDto();
        return ZoneAccessors
            .Select(z => new WorkoutSessionZone
            {
                WorkoutSessionId = workoutSessionId,
                Zone = z.Zone,
                Kind = kind,
                Minutes = z.Get(dto)
            })
            .ToList();
    }

    public static List<SessionTemplateZone> ToSessionTemplateZoneRows(int sessionTemplateId, ZoneDto? dto)
    {
        dto ??= new ZoneDto();
        return ZoneAccessors
            .Select(z => new SessionTemplateZone
            {
                SessionTemplateId = sessionTemplateId,
                Zone = z.Zone,
                Minutes = z.Get(dto)
            })
            .ToList();
    }

    private static ZoneDto FromLookup(Dictionary<string, int> byZone)
    {
        return new ZoneDto
        {
            A1 = byZone.GetValueOrDefault("a1"),
            A2 = byZone.GetValueOrDefault("a2"),
            A3Minus = byZone.GetValueOrDefault("a3_minus"),
            A3 = byZone.GetValueOrDefault("a3"),
            A3Plus = byZone.GetValueOrDefault("a3_plus"),
            Comp = byZone.GetValueOrDefault("comp"),
        };
    }
}
