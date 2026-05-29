using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;

namespace CAS.FinancePortal.Web.Server.Core.Applications
{
    /// <summary>
    /// Service interface for Monitoring operations
    /// </summary>
    public interface IMonitoringService
    {
        /// <summary>
        /// Create a new monitoring record
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, MonitoringDto? Data)> CreateMonitoringAsync(CreateMonitoringDto createDto);

        /// <summary>
        /// Get all monitoring records with pagination
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, List<MonitoringDto>? Data)> GetAllMonitoringAsync(int pageNumber = 1, int pageSize = 100);

        /// <summary>
        /// Get monitoring records for a specific employee
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, List<MonitoringDto>? Data)> GetMonitoringByEmployeeAsync(int employeeId, int days = 30);

        /// <summary>
        /// Get a specific monitoring record
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, MonitoringDto? Data)> GetMonitoringByIdAsync(Guid monitoringId);

        /// <summary>
        /// Get monitoring statistics
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, MonitoringStatsDto? Data)> GetMonitoringStatsAsync();

        /// <summary>
        /// Get today's pending WFH employees who have not yet submitted a checklist.
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, List<PendingMonitoringEmployeeDto>? Data)> GetPendingTodayAsync();
    }
}
