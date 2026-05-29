using CAS.FinancePortal.Web.Server.Core;
using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries
{
    /// <summary>
    /// Service for Monitoring operations
    /// </summary>
    public class MonitoringService(ICurrentApplicationUnitOfWork unitOfWork, ICurrentApplicationDbContext dbContext) : IMonitoringService
    {
        private readonly ICurrentApplicationUnitOfWork _unitOfWork = unitOfWork;
        private readonly ICurrentApplicationDbContext _dbContext = dbContext;

        public async Task<(bool IsSuccess, int Status, string Message, MonitoringDto? Data)> CreateMonitoringAsync(CreateMonitoringDto createDto)
        {
            try
            {
                // Verify employee exists
                var employee = await ((Microsoft.EntityFrameworkCore.DbContext)_dbContext).Set<Employee>()
                    .FirstOrDefaultAsync(e => e.Id == createDto.EmployeeId);

                if (employee == null)
                    return (false, 404, "Employee not found", null);

                // Create new monitoring record
                var monitoring = new Monitoring
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = createDto.EmployeeId,
                    EmployeeName = createDto.EmployeeName,
                    Department = createDto.Department,
                    Location = createDto.Location,
                    DownloadSpeed = createDto.DownloadSpeed,
                    UploadSpeed = createDto.UploadSpeed,
                    IpAddress = createDto.IpAddress,
                    Latitude = createDto.Latitude,
                    Longitude = createDto.Longitude,
                    CreatedAtUtc = PhilippinesTime.Now
                };

                await _unitOfWork.MonitoringRepository.AddMonitoringAsync(monitoring);
                await _unitOfWork.SaveChangesAsync();

                var dto = MapToDto(monitoring);
                return (true, 201, "Monitoring record created successfully", dto);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error creating monitoring record: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, List<MonitoringDto>? Data)> GetAllMonitoringAsync(int pageNumber = 1, int pageSize = 100)
        {
            try
            {
                var records = await _unitOfWork.MonitoringRepository.GetAllMonitoringAsync(pageNumber, pageSize);

                records ??= [];

                return (true, 200, "Monitoring records retrieved successfully", records);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving monitoring records: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, List<MonitoringDto>? Data)> GetMonitoringByEmployeeAsync(int employeeId, int days = 30)
        {
            try
            {
                var records = await _unitOfWork.MonitoringRepository.GetMonitoringByEmployeeAsync(employeeId, days);

                if (records == null || records.Count == 0)
                    return (false, 404, "No monitoring records found for this employee", null);

                return (true, 200, "Monitoring records retrieved successfully", records);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving monitoring records: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, MonitoringDto? Data)> GetMonitoringByIdAsync(Guid monitoringId)
        {
            try
            {
                var record = await _unitOfWork.MonitoringRepository.GetMonitoringByIdAsync(monitoringId);

                if (record == null)
                    return (false, 404, "Monitoring record not found", null);

                return (true, 200, "Monitoring record retrieved successfully", record);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving monitoring record: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, MonitoringStatsDto? Data)> GetMonitoringStatsAsync()
        {
            try
            {
                var stats = await _unitOfWork.MonitoringRepository.GetMonitoringStatsAsync();

                return (true, 200, "Monitoring statistics retrieved successfully", stats);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving monitoring statistics: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, List<PendingMonitoringEmployeeDto>? Data)> GetPendingTodayAsync()
        {
            try
            {
                var today = PhilippinesTime.Today;
                var tomorrow = today.AddDays(1);

                var todaysEmployeeIds = await _dbContext.Checklists
                    .AsNoTracking()
                    .Where(c => c.CreatedAt >= today && c.CreatedAt < tomorrow)
                    .Select(c => c.EmployeeId)
                    .Distinct()
                    .ToListAsync();

                var pendingEmployees = await _dbContext.Employees
                    .AsNoTracking()
                    .Where(e => e.IsActive && !todaysEmployeeIds.Contains(e.Id))
                    .Select(e => new PendingMonitoringEmployeeDto
                    {
                        EmployeeId = e.Id,
                        Name = e.FirstName + " " + e.LastName,
                        Department = e.DepartmentName
                    })
                    .OrderBy(e => e.Name)
                    .ToListAsync();

                return (true, 200, "Pending employees retrieved successfully", pendingEmployees);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving pending employees: {ex.Message}", null);
            }
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
