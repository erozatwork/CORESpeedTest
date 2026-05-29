using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Checklist;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CAS.FinancePortal.Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChecklistController(IChecklistService checklistService, IWebHostEnvironment environment) : ControllerBase
    {
        private readonly IChecklistService _checklistService = checklistService;
        private readonly IWebHostEnvironment _environment = environment;

        private bool IsLocalDevelopmentRequest()
        {
            if (!_environment.IsDevelopment())
                return false;

            var host = Request.Host.Host;

            return string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase)
                || string.Equals(host, "127.0.0.1", StringComparison.OrdinalIgnoreCase)
                || string.Equals(host, "::1", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Get current user's employee ID from claims
        /// </summary>
        private int GetEmployeeId()
        {
            var employeeIdClaim = User.FindFirst("employee_id")?.Value
                ?? User.FindFirst("nameid")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? (IsLocalDevelopmentRequest() ? "9" : null);

            if (employeeIdClaim == null)
                throw new UnauthorizedAccessException("Employee ID not found in token");

            if (!int.TryParse(employeeIdClaim, out var employeeId))
            {
                if (IsLocalDevelopmentRequest())
                    return 9;

                throw new UnauthorizedAccessException("Invalid employee ID in token");
            }

            return employeeId;
        }

        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateChecklist([FromBody] CreateChecklistDto createChecklistDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (createChecklistDto.EmployeeId <= 0 && IsLocalDevelopmentRequest())
                createChecklistDto.EmployeeId = 9;

            var result = await _checklistService.CreateChecklistAsync(createChecklistDto);

            if (!result.IsSuccess)
                return StatusCode(result.Status, new { success = false, message = result.Message });

            return StatusCode(result.Status, new { success = true, message = result.Message, data = result.Data });
        }

        [AllowAnonymous]
        [HttpGet("today")]
        public async Task<IActionResult> GetChecklistToday()
        {
            try
            {
                var employeeId = GetEmployeeId();
                var result = await _checklistService.GetChecklistTodayAsync(employeeId);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("history")]
        public async Task<IActionResult> GetChecklistHistory([FromQuery] int days = 30)
        {
            try
            {
                var employeeId = GetEmployeeId();
                var result = await _checklistService.GetChecklistHistoryAsync(employeeId, days);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("update/{checklistId}")]
        public async Task<IActionResult> UpdateChecklist(Guid checklistId, [FromBody] CreateChecklistDto updateChecklistDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _checklistService.UpdateChecklistAsync(checklistId, updateChecklistDto);

            if (!result.IsSuccess)
                return StatusCode(result.Status, new { success = false, message = result.Message });

            return Ok(new { success = true, message = result.Message, data = result.Data });
        }

        [HttpDelete("delete/{checklistId}")]
        public async Task<IActionResult> DeleteChecklist(Guid checklistId)
        {
            var result = await _checklistService.DeleteChecklistAsync(checklistId);

            if (!result.IsSuccess)
                return StatusCode(result.Status, new { success = false, message = result.Message });

            return Ok(new { success = true, message = result.Message });
        }

        [AllowAnonymous]
        [HttpGet("stats")]
        public async Task<IActionResult> GetChecklistStats()
        {
            try
            {
                var employeeId = GetEmployeeId();
                var result = await _checklistService.GetChecklistStatsAsync(employeeId);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }
    }
}
