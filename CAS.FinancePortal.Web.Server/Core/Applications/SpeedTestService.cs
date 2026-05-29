using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CAS.FinancePortal.Web.Server.Core;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.SpeedTest;
using CAS.FinancePortal.Web.Server.Core.Models.Entities;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Core.Applications
{
    /// <summary>
    /// Implementation of speed test service
    /// </summary>
    public class SpeedTestService(CurrentApplicationDbContext dbContext) : ISpeedTestService
    {
        private readonly CurrentApplicationDbContext _dbContext = dbContext;

        /// <summary>
        /// Create a new speed test result
        /// </summary>
        public async Task<(bool IsSuccess, int Status, string Message, SpeedTestResultResponse? Data)> CreateSpeedTestAsync(int employeeId, SpeedTestResultRequest request)
        {
            try
            {
                if (employeeId <= 0)
                    return (false, 400, "Invalid employee ID", null);

                if (request.DownloadMbps < 0 || request.UploadMbps < 0)
                    return (false, 400, "Speed values cannot be negative", null);

                var entity = new SpeedTestResult
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = employeeId,
                    DownloadMbps = request.DownloadMbps,
                    UploadMbps = request.UploadMbps,
                    LatencyMs = request.LatencyMs,
                    PublicIp = request.PublicIp ?? string.Empty,
                    ClientBrowser = request.ClientBrowser ?? string.Empty,
                    ClientOs = request.ClientOs ?? string.Empty,
                    RawJson = request.RawJson ?? string.Empty,
                    MeasuredAtUtc = PhilippinesTime.NowOffset,
                    CreatedAtUtc = PhilippinesTime.NowOffset
                };

                _dbContext.SpeedTestResults.Add(entity);
                await _dbContext.SaveChangesAsync();

                var response = MapToResponse(entity);
                return (true, 201, "Speed test result created successfully", response);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message;
                var detail = string.IsNullOrWhiteSpace(inner) ? ex.Message : $"{ex.Message} | Inner: {inner}";
                return (false, 500, $"Error creating speed test result: {detail}", null);
            }
        }

        /// <summary>
        /// Get speed test history for an employee
        /// </summary>
        public async Task<(bool IsSuccess, int Status, string Message, List<SpeedTestResultResponse>? Data)> GetSpeedTestHistoryAsync(int employeeId, int days = 30)
        {
            try
            {
                if (employeeId <= 0)
                    return (false, 400, "Invalid employee ID", null);

                var cutoffDate = PhilippinesTime.NowOffset.AddDays(-days);

                var results = await _dbContext.SpeedTestResults
                    .Where(r => r.EmployeeId == employeeId && r.CreatedAtUtc >= cutoffDate)
                    .OrderByDescending(r => r.CreatedAtUtc)
                    .Select(r => MapToResponse(r))
                    .ToListAsync();

                return (true, 200, $"Retrieved {results.Count} speed test results", results);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message;
                var detail = string.IsNullOrWhiteSpace(inner) ? ex.Message : $"{ex.Message} | Inner: {inner}";
                return (false, 500, $"Error retrieving speed test history: {detail}", null);
            }
        }

        /// <summary>
        /// Get speed test statistics for an employee
        /// </summary>
        public async Task<(bool IsSuccess, int Status, string Message, SpeedTestStatsResponse? Data)> GetSpeedTestStatsAsync(int employeeId, int days = 30)
        {
            try
            {
                if (employeeId <= 0)
                    return (false, 400, "Invalid employee ID", null);

                var cutoffDate = PhilippinesTime.NowOffset.AddDays(-days);

                var results = await _dbContext.SpeedTestResults
                    .Where(r => r.EmployeeId == employeeId && r.CreatedAtUtc >= cutoffDate)
                    .ToListAsync();

                if (!results.Any())
                    return (false, 404, "No speed test results found", null);

                var stats = new SpeedTestStatsResponse(
                    AverageDownloadMbps: Math.Round(results.Average(r => r.DownloadMbps), 2),
                    AverageUploadMbps: Math.Round(results.Average(r => r.UploadMbps), 2),
                    MaxDownloadMbps: results.Max(r => r.DownloadMbps),
                    MinDownloadMbps: results.Min(r => r.DownloadMbps),
                    MaxUploadMbps: results.Max(r => r.UploadMbps),
                    MinUploadMbps: results.Min(r => r.UploadMbps),
                    TestCount: results.Count,
                    LastTestAtUtc: results.Max(r => r.CreatedAtUtc)
                );

                return (true, 200, "Speed test statistics retrieved successfully", stats);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message;
                var detail = string.IsNullOrWhiteSpace(inner) ? ex.Message : $"{ex.Message} | Inner: {inner}";
                return (false, 500, $"Error retrieving speed test statistics: {detail}", null);
            }
        }

        /// <summary>
        /// Get the latest speed test result for an employee
        /// </summary>
        public async Task<(bool IsSuccess, int Status, string Message, SpeedTestResultResponse? Data)> GetLatestSpeedTestAsync(int employeeId)
        {
            try
            {
                if (employeeId <= 0)
                    return (false, 400, "Invalid employee ID", null);

                var result = await _dbContext.SpeedTestResults
                    .Where(r => r.EmployeeId == employeeId)
                    .OrderByDescending(r => r.CreatedAtUtc)
                    .FirstOrDefaultAsync();

                if (result is null)
                    return (false, 404, "No speed test results found", null);

                return (true, 200, "Latest speed test result retrieved successfully", MapToResponse(result));
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message;
                var detail = string.IsNullOrWhiteSpace(inner) ? ex.Message : $"{ex.Message} | Inner: {inner}";
                return (false, 500, $"Error retrieving latest speed test: {detail}", null);
            }
        }

        /// <summary>
        /// Delete a speed test result
        /// </summary>
        public async Task<(bool IsSuccess, int Status, string Message)> DeleteSpeedTestAsync(Guid speedTestId)
        {
            try
            {
                var entity = await _dbContext.SpeedTestResults.FindAsync(speedTestId);
                if (entity is null)
                    return (false, 404, "Speed test result not found");

                _dbContext.SpeedTestResults.Remove(entity);
                await _dbContext.SaveChangesAsync();

                return (true, 200, "Speed test result deleted successfully");
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException?.Message;
                var detail = string.IsNullOrWhiteSpace(inner) ? ex.Message : $"{ex.Message} | Inner: {inner}";
                return (false, 500, $"Error deleting speed test result: {detail}");
            }
        }

        /// <summary>
        /// Map entity to response DTO
        /// </summary>
        private static SpeedTestResultResponse MapToResponse(SpeedTestResult entity)
        {
            return new SpeedTestResultResponse(
                Id: entity.Id,
                EmployeeId: entity.EmployeeId,
                DownloadMbps: entity.DownloadMbps,
                UploadMbps: entity.UploadMbps,
                LatencyMs: entity.LatencyMs,
                PublicIp: entity.PublicIp,
                ClientBrowser: entity.ClientBrowser,
                ClientOs: entity.ClientOs,
                MeasuredAtUtc: entity.MeasuredAtUtc,
                CreatedAtUtc: entity.CreatedAtUtc
            );
        }
    }
}
