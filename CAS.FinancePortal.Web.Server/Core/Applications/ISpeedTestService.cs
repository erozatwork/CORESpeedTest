using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.SpeedTest;

namespace CAS.FinancePortal.Web.Server.Core.Applications
{
    /// <summary>
    /// Service for managing speed test results
    /// </summary>
    public interface ISpeedTestService
    {
        /// <summary>
        /// Create a new speed test result
        /// </summary>

        /// <summary>
        /// Get speed test history for an employee
        /// </summary>

        /// <summary>
        /// Get speed test statistics for an employee
        /// </summary>

        /// <summary>
        /// Get the latest speed test result for an employee
        /// </summary>

        /// <summary>
        /// Delete a speed test result
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, SpeedTestResultResponse? Data)> CreateSpeedTestAsync(int employeeId, SpeedTestResultRequest request);

        /// <summary>
        /// Get speed test history for an employee
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, List<SpeedTestResultResponse>? Data)> GetSpeedTestHistoryAsync(int employeeId, int days = 30);

        /// <summary>
        /// Get speed test statistics for an employee
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, SpeedTestStatsResponse? Data)> GetSpeedTestStatsAsync(int employeeId, int days = 30);

        /// <summary>
        /// Get the latest speed test result for an employee
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message, SpeedTestResultResponse? Data)> GetLatestSpeedTestAsync(int employeeId);

        /// <summary>
        /// Delete a speed test result
        /// </summary>
        Task<(bool IsSuccess, int Status, string Message)> DeleteSpeedTestAsync(Guid speedTestId);
    }
}
