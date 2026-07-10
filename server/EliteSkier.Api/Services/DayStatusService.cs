using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Data.Repositories;

namespace EliteSkier.Api.Services;

public class DayStatusService : IDayStatusService
{
    private readonly IDayStatusRepository _repository;
    private readonly ICurrentUserService _currentUserService;

    public DayStatusService(IDayStatusRepository repository, ICurrentUserService currentUserService)
    {
        _repository = repository;
        _currentUserService = currentUserService;
    }

    // ÄNDRAT: Lagt till int userId i parametern och skickar med det till repo
    public async Task<DayStatusDto?> GetStatusByDateAsync(int userId, DateTime date)
    {
        if (!await _currentUserService.CanAccessUserAsync(userId))
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att se denna dagsstatus.");
        }

        var model = await _repository.GetByDateAsync(userId, date);
        if (model == null) return null;

        return MapToDto(model);
    }

    public async Task<DayStatusDto> SaveStatusAsync(DayStatusDto dto)
    {
        if (!await _currentUserService.CanAccessUserAsync(dto.UserId))
        {
            throw new UnauthorizedAccessException("Du kan inte spara dagsstatus för denna användare.");
        }

        var model = new DayStatus
        {
            Id = dto.Id,
            UserId = dto.UserId,
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
            UserId = model.UserId,
            Sick = model.Sick,
            Injured = model.Injured,
            Day = model.Day,
            RestingHeartRate = model.RestingHeartRate,
            Hrv = model.Hrv,
            RestDay = model.RestDay,
            TravelDay = model.TravelDay
        };
    }

    // ÄNDRAT: Lagt till int userId i parametern och skickar med det till repo
    public async Task<List<DayStatusDto>> GetAllStatusesAsync(int userId)
    {
        if (!await _currentUserService.CanAccessUserAsync(userId))
        {
            throw new UnauthorizedAccessException("Du har inte behörighet att se denna dagsstatus.");
        }

        // 1. Hämta alla modeller filtrerat på användaren från databasen via ditt repository
        var models = await _repository.GetAllAsync(userId);
        
        // 2. Mappa om varje modell i listan till en DTO med hjälp av din existerande MapToDto-metod
        return models.Select(model => MapToDto(model)).ToList();
    }
}