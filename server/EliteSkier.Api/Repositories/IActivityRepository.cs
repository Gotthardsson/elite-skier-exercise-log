using EliteSkier.Api.Data;   // För att hitta AppDbContext
using EliteSkier.Api.Models; // För att hitta Activity/User
using Microsoft.EntityFrameworkCore;
namespace EliteSkier.Api.Repositories;

public interface IActivityRepository
{
    Task<IEnumerable<Activity>> GetAllAsync();
}