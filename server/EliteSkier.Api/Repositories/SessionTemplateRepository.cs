using EliteSkier.Api.Data;
using EliteSkier.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EliteSkier.Api.Repositories;
public class SessionTemplateRepository : ISessionTemplateRepository
{
    private readonly AppDbContext _context;

    public SessionTemplateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SessionTemplate?> GetByIdAsync(int id) =>
        await _context.SessionTemplates.FindAsync(id);

    public async Task<IEnumerable<SessionTemplate>> GetAllByUserIdAsync(int userId) =>
        await _context.SessionTemplates
            .Where(t => t.Creator_id == userId)
            .OrderByDescending(t => t.Created_at)
            .ToListAsync();

    public async Task<SessionTemplate> AddAsync(SessionTemplate template)
    {
        _context.SessionTemplates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task UpdateAsync(SessionTemplate template)
    {
        _context.Entry(template).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var template = await _context.SessionTemplates.FindAsync(id);
        if (template != null)
        {
            _context.SessionTemplates.Remove(template);
            await _context.SaveChangesAsync();
        }
    }
}