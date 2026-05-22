using EliteSkier.Api.Dtos;
using EliteSkier.Api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EliteSkier.Api.Services;

public class HeartrateZoneService : IHeartrateZoneService
{
    private readonly IUserHeartRateRepository _zonesRepo;

    public HeartrateZoneService(IUserHeartRateRepository zonesRepo)
    {
        _zonesRepo = zonesRepo;
    }

    public async Task<ZoneDto> CalculateTimeInZonesAsync(int userId, List<int> hrList, List<int> timeList, List<bool> movingList)
    {
        var result = new ZoneDto();
        
        // FIXAT: Använd ditt repository istället för _context!
        // OBS: Dubbelkolla om din metod i repot heter GetLatestByUserIdAsync eller något liknande
         var zones = await _zonesRepo.GetByUserIdAsync(userId);

        if (zones == null) return result;

        for (int i = 1; i < hrList.Count; i++)
        {
            // SKIPPA SEKUNDEN OM ÅKAREN STOD STILL!
            if (movingList != null && i < movingList.Count && !movingList[i])
            {
                continue; 
            }

            int duration = timeList[i] - timeList[i - 1];
            int currentHR = hrList[i];

            if (duration > 5) duration = 1; 

            // Pulszonsstegen
            if (currentHR <= zones.A1Max) result.A1 += duration;
            else if (currentHR <= zones.A2Max) result.A2 += duration;
            else if (currentHR <= zones.A3MinusMax) result.A3Minus += duration;
            else if (currentHR <= zones.A3Max) result.A3 += duration;
            else if (currentHR <= zones.A3PlusMax) result.A3Plus += duration;
            else if (currentHR <= (zones.CompitionMax ?? 999)) result.Comp += duration;
        }

        var minutesResult = new ZoneDto
        {
            A1 = (int)Math.Round(result.A1 / 60.0),
            A2 = (int)Math.Round(result.A2 / 60.0),
            A3Minus = (int)Math.Round(result.A3Minus / 60.0),
            A3 = (int)Math.Round(result.A3 / 60.0),
            A3Plus = (int)Math.Round(result.A3Plus / 60.0),
            Comp = (int)Math.Round(result.Comp / 60.0)
        };

        return minutesResult;
    }
}
