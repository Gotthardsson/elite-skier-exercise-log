using EliteSkier.Api.Dtos;

namespace EliteSkier.Api.Services;

public interface IDayStatusService
{
    Task<DayStatusDto?> GetStatusByDateAsync(int userId, DateTime date);
    Task<List<DayStatusDto>> GetAllStatusesAsync(int userId);
    Task<DayStatusDto> SaveStatusAsync(DayStatusDto dto);
}