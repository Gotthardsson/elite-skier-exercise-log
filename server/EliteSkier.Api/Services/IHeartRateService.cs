using EliteSkier.Api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EliteSkier.Api.Services;

public interface IHeartrateZoneService
{
    // Se till att det står ZoneDto här, INTE HeartRateZoneDto
    Task<ZoneDto> CalculateTimeInZonesAsync(int userId, List<int> hrList, List<int> timeList, List<bool> movingList);
}