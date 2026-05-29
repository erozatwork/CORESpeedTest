using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;

namespace CAS.FinancePortal.Web.Server.Core.Repositories
{
    /// <summary>
    /// Repository interface for Monitoring entity operations
    /// </summary>
    public interface IMonitoringRepository
    {
        /// <summary>
        /// Create a new monitoring record
        /// </summary>
        Task AddMonitoringAsync(Core.Models.Entities.CurrentApplication.Tables.Monitoring monitoring);

        /// <summary>
        /// Get all monitoring records (with optional pagination)
        /// </summary>
        Task<List<MonitoringDto>> GetAllMonitoringAsync(int pageNumber = 1, int pageSize = 100);

        /// <summary>
        /// Get monitoring records by employee ID
        /// </summary>
        Task<List<MonitoringDto>> GetMonitoringByEmployeeAsync(int employeeId, int days = 30);

        /// <summary>
        /// Get a specific monitoring record by ID
        /// </summary>
        Task<MonitoringDto?> GetMonitoringByIdAsync(Guid monitoringId);

        /// <summary>
        /// Get total count of monitoring records
        /// </summary>
        Task<int> GetTotalCountAsync();

        /// <summary>
        /// Get unique employee count from monitoring records
        /// </summary>
        Task<int> GetUniqueEmployeeCountAsync();

        /// <summary>
        /// Get monitoring statistics
        /// </summary>
        Task<MonitoringStatsDto> GetMonitoringStatsAsync();
    }
}
