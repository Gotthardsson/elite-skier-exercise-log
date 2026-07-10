using EliteSkier.Api.Dtos;
using EliteSkier.Api.Models;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SessionTemplateController : ControllerBase
{
    private readonly ISessionTemplateService _service;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<SessionTemplateController> _logger;

    public SessionTemplateController(ISessionTemplateService service, ICurrentUserService currentUserService, ILogger<SessionTemplateController> logger)
    {
        _service = service;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    // GET: api/sessiontemplate/user/1
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<SessionTemplateDto>>> GetUserTemplates(int userId)
    {
        try
        {
            var templates = await _service.GetUserTemplatesAsync(userId);
            return Ok(templates);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // POST: api/sessiontemplate
    [HttpPost]
    public async Task<ActionResult<SessionTemplateDto>> CreateTemplate([FromBody] SessionTemplateDto templateDto)
    {
        if (templateDto == null || !ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            templateDto.CreatorId = currentUser.Id;

            var createdTemplate = await _service.CreateTemplateAsync(templateDto);

            // Returnera 201 Created och den nyskapade templaten
            return CreatedAtAction(nameof(GetUserTemplates), new { userId = createdTemplate.CreatorId }, createdTemplate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create session template");
            return StatusCode(500, "An error occurred while creating the template.");
        }
    }

     // DELETE: api/sessiontemplate/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTemplate(int id)
    {
        var template = await _service.GetTemplateByIdAsync(id);
        if (template == null)
        {
            return NotFound();
        }

        try
        {
            await _service.DeleteTemplateAsync(id);
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // PUT: api/sessiontemplate/5
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTemplate(int id, [FromBody] SessionTemplateDto dto)
    {
        if (dto == null || !ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _service.UpdateTemplateAsync(dto);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update session template {TemplateId}", id);
            return StatusCode(500, "An error occurred while updating the template.");
        }
    }
}