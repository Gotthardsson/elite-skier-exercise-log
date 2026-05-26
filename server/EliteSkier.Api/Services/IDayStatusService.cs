using EliteSkier.Api.Dtos;

namespace EliteSkier.Api.Services;

public interface IDayStatusService
{
    Task<DayStatusDto?> GetStatusByDateAsync(DateTime date);
    Task<DayStatusDto> SaveStatusAsync(DayStatusDto dto);

    Task<List<DayStatusDto>> GetAllStatusesAsync();
}