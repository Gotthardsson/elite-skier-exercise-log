using EliteSkier.Api.Models;
using EliteSkier.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EliteSkier.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FolderController : ControllerBase
{
    private readonly IFolderService _folderService;

    public FolderController(IFolderService folderService)
    {
        _folderService = folderService;
    }
        // GET: api/folder/user/1
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Folder>>> GetFolders(int userId)
    {
        try
        {
            var folders = await _folderService.GetFoldersByUserIdAsync(userId);
            return Ok(folders);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost]
    public async Task<ActionResult<Folder>> CreateFolder(Folder folder)
    {
        try
        {
            var createdFolder = await _folderService.CreateFolderAsync(folder);
            return CreatedAtAction(nameof(GetFolders), new { userId = createdFolder.UserId }, createdFolder);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
