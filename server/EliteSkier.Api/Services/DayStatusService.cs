using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Data.Repositories;

namespace EliteSkier.Api.Services;

public class DayStatusService : IDayStatusService
{
    private readonly IDayStatusRepository _repository;

    public DayStatusService(IDayStatusRepository repository)
    {
        _repository = repository;
    }

    public async Task<DayStatusDto?> GetStatusByDateAsync(DateTime date)
    {
        var model = await _repository.GetByDateAsync(date);
        if (model == null) return null;

        return MapToDto(model);
    }

    public async Task<DayStatusDto> SaveStatusAsync(DayStatusDto dto)
    {
        var model = new DayStatus
        {
            Id = dto.Id,
            Sick = dto.Sick,
            Injured = dto.Injured,
            Day = dto.Day.Date, // Spara rent datum utan klockslag
            RestingHeartRate = dto.RestingHeartRate,
            Hrv = dto.Hrv,
            RestDay = dto.RestDay,
            TravelDay = dto.TravelDay
        };

        var savedModel = await _repository.UpsertAsync(model);
        return MapToDto(savedModel);
    }


    private static DayStatusDto MapToDto(DayStatus model)
    {
        return new DayStatusDto
        {
            Id = model.Id,
            Sick = model.Sick,
            Injured = model.Injured,
            Day = model.Day,
            RestingHeartRate = model.RestingHeartRate,
            Hrv = model.Hrv,
            RestDay=model.RestDay,
            TravelDay=model.TravelDay
        };
    }

    public async Task<List<DayStatusDto>> GetAllStatusesAsync()
    {
        // 1. Hämta alla modeller från databasen via ditt repository
        var models = await _repository.GetAllAsync(); 
        
        // 2. Mappa om varje modell i listan till en DTO med hjälp av din existerande MapToDto-metod
        return models.Select(model => MapToDto(model)).ToList();
    }
}