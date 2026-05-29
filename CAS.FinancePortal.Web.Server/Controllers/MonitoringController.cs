using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CAS.FinancePortal.Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MonitoringController(IMonitoringService monitoringService) : ControllerBase
    {
        private readonly IMonitoringService _monitoringService = monitoringService;

        /// <summary>
        /// Get current user's employee ID from claims
        /// </summary>
        private int GetEmployeeId()
        {
            var employeeIdClaim = User.FindFirst("employee_id")?.Value 
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException("Employee ID not found in token");

            if (!int.TryParse(employeeIdClaim, out var employeeId))
                throw new UnauthorizedAccessException("Invalid employee ID in token");

            return employeeId;
        }

        /// <summary>
        /// Create a new monitoring record
        /// </summary>
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateMonitoring([FromBody] CreateMonitoringDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _monitoringService.CreateMonitoringAsync(createDto);

            if (!result.IsSuccess)
                return StatusCode(result.Status, new { success = false, message = result.Message });

            return StatusCode(result.Status, new { success = true, message = result.Message, data = result.Data });
        }

        /// <summary>
        /// Get all monitoring records with pagination
        /// </summary>
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllMonitoring([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 100)
        {
            try
            {
                var result = await _monitoringService.GetAllMonitoringAsync(pageNumber, pageSize);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get monitoring records for current employee
        /// </summary>
        [HttpGet("employee")]
        public async Task<IActionResult> GetEmployeeMonitoring([FromQuery] int days = 30)
        {
            try
            {
                var employeeId = GetEmployeeId();
                var result = await _monitoringService.GetMonitoringByEmployeeAsync(employeeId, days);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific monitoring record by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMonitoringById(Guid id)
        {
            try
            {
                var result = await _monitoringService.GetMonitoringByIdAsync(id);

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get monitoring statistics
        /// </summary>
        [AllowAnonymous]
        [HttpGet("stats/overview")]
        public async Task<IActionResult> GetMonitoringStats()
        {
            try
            {
                var result = await _monitoringService.GetMonitoringStatsAsync();

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get today's pending WFH employees who have not submitted a checklist yet
        /// </summary>
        [AllowAnonymous]
        [HttpGet("pending/today")]
        public async Task<IActionResult> GetPendingToday()
        {
            try
            {
                var result = await _monitoringService.GetPendingTodayAsync();

                if (!result.IsSuccess)
                    return StatusCode(result.Status, new { success = false, message = result.Message });

                return Ok(new { success = true, message = result.Message, data = result.Data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
