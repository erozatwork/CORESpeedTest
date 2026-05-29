using CAS.FinancePortal.Web.Server.Core;
using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.Repositories
{
    /// <summary>
    /// Repository for Monitoring entity operations
    /// </summary>
    public class MonitoringRepository(ICurrentApplicationDbContext context) : GenericRepository<Monitoring>(context), IMonitoringRepository
    {
        private readonly DbSet<Monitoring> _dbSet = ((Microsoft.EntityFrameworkCore.DbContext)context).Set<Monitoring>();

        public async Task AddMonitoringAsync(Monitoring monitoring)
        {
            await _dbSet.AddAsync(monitoring);
        }

        public async Task<List<MonitoringDto>> GetAllMonitoringAsync(int pageNumber = 1, int pageSize = 100)
        {
            var records = await _dbSet
                .OrderByDescending(m => m.CreatedAtUtc)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return records.Select(MapToDto).ToList();
        }

        public async Task<List<MonitoringDto>> GetMonitoringByEmployeeAsync(int employeeId, int days = 30)
        {
            var startDate = PhilippinesTime.Now.AddDays(-days);

            var records = await _dbSet
                .Where(m => m.EmployeeId == employeeId && m.CreatedAtUtc >= startDate)
                .OrderByDescending(m => m.CreatedAtUtc)
                .ToListAsync();

            return records.Select(MapToDto).ToList();
        }

        public async Task<MonitoringDto?> GetMonitoringByIdAsync(Guid monitoringId)
        {
            var record = await _dbSet
                .FirstOrDefaultAsync(m => m.Id == monitoringId);

            return record == null ? null : MapToDto(record);
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<int> GetUniqueEmployeeCountAsync()
        {
            return await _dbSet
                .Select(m => m.EmployeeId)
                .Distinct()
                .CountAsync();
        }

        public async Task<MonitoringStatsDto> GetMonitoringStatsAsync()
        {
            var query = _dbSet.AsQueryable();
            var totalRecords = await query.CountAsync();
            var uniqueEmployees = await query.Select(m => m.EmployeeId).Distinct().CountAsync();
            var oldestRecord = await query.OrderBy(m => m.CreatedAtUtc).Select(m => m.CreatedAtUtc).FirstOrDefaultAsync();
            var latestRecord = await query.OrderByDescending(m => m.CreatedAtUtc).Select(m => m.CreatedAtUtc).FirstOrDefaultAsync();
            var downloadSpeeds = query.Where(m => m.DownloadSpeed.HasValue);
            var uploadSpeeds = query.Where(m => m.UploadSpeed.HasValue);

            decimal? avgDownload = await downloadSpeeds.AnyAsync()
                ? await downloadSpeeds.AverageAsync(m => m.DownloadSpeed!.Value)
                : null;

            decimal? avgUpload = await uploadSpeeds.AnyAsync()
                ? await uploadSpeeds.AverageAsync(m => m.UploadSpeed!.Value)
                : null;

            return new MonitoringStatsDto
            {
                TotalRecords = totalRecords,
                UniqueEmployees = uniqueEmployees,
                OldestRecord = oldestRecord == default ? null : oldestRecord,
                LatestRecord = latestRecord == default ? null : latestRecord,
                AverageDownloadSpeed = avgDownload,
                AverageUploadSpeed = avgUpload
            };
        }

        private MonitoringDto MapToDto(Monitoring monitoring)
        {
            return new MonitoringDto
            {
                Id = monitoring.Id,
                EmployeeId = monitoring.EmployeeId,
                EmployeeName = monitoring.EmployeeName,
                Department = monitoring.Department,
                Location = monitoring.Location,
                DownloadSpeed = monitoring.DownloadSpeed,
                UploadSpeed = monitoring.UploadSpeed,
                IpAddress = monitoring.IpAddress,
                Latitude = monitoring.Latitude,
                Longitude = monitoring.Longitude,
                CreatedAtUtc = monitoring.CreatedAtUtc
            };
        }
    }
}
