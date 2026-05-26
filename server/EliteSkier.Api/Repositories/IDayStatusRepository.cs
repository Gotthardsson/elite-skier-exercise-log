using EliteSkier.Api.Models;


namespace EliteSkier.Api.Data.Repositories;

public interface IDayStatusRepository
{
    Task<DayStatus?> GetByDateAsync(int userID, DateTime date);
    Task<DayStatus> UpsertAsync(DayStatus status);

    Task<List<DayStatus>> GetAllAsync(int userID);
}