using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Mvc;


namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]

public class SessionTemplateController : ControllerBase
{
    private readonly ISessionTemplateService _service;

    public SessionTemplateController(ISessionTemplateService service)
    {
        _service = service;
    }

    // GET: api/sessiontemplate/user/1
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<SessionTemplateDto>>> GetUserTemplates(int userId)
    {
        var templates = await _service.GetUserTemplatesAsync(userId);
        return Ok(templates);
    }

    // POST: api/sessiontemplate
    [HttpPost]
    public async Task<ActionResult<SessionTemplateDto>> CreateTemplate([FromBody] SessionTemplateDto templateDto)
    {
        if (templateDto == null)
        {
            return BadRequest("Template data is missing.");
        }

        try
        {
            // Vi hårdkodar CreatorId till 1 för nu, tills du har ett inloggningssystem
            templateDto.CreatorId = 1; 
            
            var createdTemplate = await _service.CreateTemplateAsync(templateDto);
            
            // Returnera 201 Created och den nyskapade templaten
            return CreatedAtAction(nameof(GetUserTemplates), new { userId = createdTemplate.CreatorId }, createdTemplate);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while creating the template. " + ex.Message);
        }
    }
}