using CAS.FinancePortal.Web.Server.Core;
using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Checklist;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using CAS.FinancePortal.Web.Server.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries
{
    public class ChecklistService(ICurrentApplicationUnitOfWork unitOfWork, ICurrentApplicationDbContext dbContext) : IChecklistService
    {
        private readonly ICurrentApplicationUnitOfWork _unitOfWork = unitOfWork;
        private readonly ICurrentApplicationDbContext _dbContext = dbContext;

        public async Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> CreateChecklistAsync(CreateChecklistDto createChecklistDto)
        {
            try
            {
                // Verify employee exists
                var employee = await ((Microsoft.EntityFrameworkCore.DbContext)_dbContext).Set<Employee>()
                    .FirstOrDefaultAsync(e => e.Id == createChecklistDto.EmployeeId);

                if (employee == null)
                    return (false, 404, "Employee not found", null);

                // Create new checklist
                var checklist = new Checklist
                {
                    ChecklistId = Guid.NewGuid(),
                    EmployeeId = createChecklistDto.EmployeeId,
                    DownloadSpeed = createChecklistDto.DownloadSpeed,
                    UploadSpeed = createChecklistDto.UploadSpeed,
                    Latitude = createChecklistDto.Latitude,
                    Longitude = createChecklistDto.Longitude,
                    Address = createChecklistDto.Address,
                    PublicIp = createChecklistDto.PublicIp,
                    DeviceStatus = createChecklistDto.DeviceStatus ?? "online",
                    Signal = createChecklistDto.Signal ?? "strong",
                    CameraStatus = createChecklistDto.CameraStatus ?? "offline",
                    Battery = createChecklistDto.Battery ?? 100,
                    IsWFH = createChecklistDto.IsWFH ?? true,
                    CreatedAt = PhilippinesTime.Now,
                    UpdatedAt = PhilippinesTime.Now
                };

                await _unitOfWork.ChecklistRepository.AddAsync(checklist);
                await _unitOfWork.SaveChangesAsync();

                var dto = MapToDto(checklist);
                return (true, 201, "Checklist created successfully", dto);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error creating checklist: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> GetChecklistTodayAsync(int employeeId)
        {
            try
            {
                var checklist = await _unitOfWork.ChecklistRepository.GetChecklistTodayByEmployeeAsync(employeeId);

                if (checklist == null)
                    return (true, 200, "No checklist found for today", null);

                return (true, 200, "Checklist retrieved successfully", checklist);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving checklist: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, List<ChecklistDto>? Data)> GetChecklistHistoryAsync(int employeeId, int days = 30)
        {
            try
            {
                var checklists = await _unitOfWork.ChecklistRepository.GetChecklistHistoryByEmployeeAsync(employeeId, days);

                if (checklists == null || checklists.Count == 0)
                    return (false, 404, "No checklist history found", null);

                return (true, 200, "Checklist history retrieved successfully", checklists);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving checklist history: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> UpdateChecklistAsync(Guid checklistId, CreateChecklistDto updateChecklistDto)
        {
            try
            {
                var checklist = await _unitOfWork.ChecklistRepository.GetByIdAsync((int)checklistId.GetHashCode());

                if (checklist == null)
                    return (false, 404, "Checklist not found", null);

                // Get the actual checklist by ID (need to query properly)
                var checklistEntity = await ((Microsoft.EntityFrameworkCore.DbContext)_dbContext)
                    .Set<Checklist>()
                    .FirstOrDefaultAsync(c => c.ChecklistId == checklistId);

                if (checklistEntity == null)
                    return (false, 404, "Checklist not found", null);

                // Update fields
                checklistEntity.DownloadSpeed = updateChecklistDto.DownloadSpeed;
                checklistEntity.UploadSpeed = updateChecklistDto.UploadSpeed;
                checklistEntity.Latitude = updateChecklistDto.Latitude;
                checklistEntity.Longitude = updateChecklistDto.Longitude;
                checklistEntity.Address = updateChecklistDto.Address;
                checklistEntity.PublicIp = updateChecklistDto.PublicIp;
                checklistEntity.DeviceStatus = updateChecklistDto.DeviceStatus ?? "online";
                checklistEntity.Signal = updateChecklistDto.Signal ?? "strong";
                checklistEntity.CameraStatus = updateChecklistDto.CameraStatus ?? "offline";
                checklistEntity.Battery = updateChecklistDto.Battery ?? 100;
                checklistEntity.IsWFH = updateChecklistDto.IsWFH ?? true;
                checklistEntity.UpdatedAt = PhilippinesTime.Now;

                _unitOfWork.ChecklistRepository.Update(checklistEntity);
                await _unitOfWork.SaveChangesAsync();

                var dto = MapToDto(checklistEntity);
                return (true, 200, "Checklist updated successfully", dto);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error updating checklist: {ex.Message}", null);
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message)> DeleteChecklistAsync(Guid checklistId)
        {
            try
            {
                var checklistEntity = await ((Microsoft.EntityFrameworkCore.DbContext)_dbContext)
                    .Set<Checklist>()
                    .FirstOrDefaultAsync(c => c.ChecklistId == checklistId);

                if (checklistEntity == null)
                    return (false, 404, "Checklist not found");

                _unitOfWork.ChecklistRepository.Remove(checklistEntity);
                await _unitOfWork.SaveChangesAsync();

                return (true, 200, "Checklist deleted successfully");
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error deleting checklist: {ex.Message}");
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, dynamic? Data)> GetChecklistStatsAsync(int employeeId)
        {
            try
            {
                var dbSet = ((Microsoft.EntityFrameworkCore.DbContext)_dbContext).Set<Checklist>();
                var stats = await dbSet
                    .Where(c => c.EmployeeId == employeeId)
                    .GroupBy(c => c.EmployeeId)
                    .Select(g => new
                    {
                        TotalChecklists = g.Count(),
                        AverageDownloadSpeed = g.Average(c => c.DownloadSpeed),
                        AverageUploadSpeed = g.Average(c => c.UploadSpeed),
                        AverageBattery = g.Average(c => c.Battery),
                        LastCheckin = g.OrderByDescending(c => c.CreatedAt).First().CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (stats == null)
                    return (false, 404, "No stats found", null);

                return (true, 200, "Stats retrieved successfully", (dynamic)stats);
            }
            catch (Exception ex)
            {
                return (false, 500, $"Error retrieving stats: {ex.Message}", null);
            }
        }

        private ChecklistDto MapToDto(Checklist checklist)
        {
            return new ChecklistDto
            {
                ChecklistId = checklist.ChecklistId,
                EmployeeId = checklist.EmployeeId,
                DownloadSpeed = checklist.DownloadSpeed,
                UploadSpeed = checklist.UploadSpeed,
                Latitude = checklist.Latitude,
                Longitude = checklist.Longitude,
                Address = checklist.Address,
                PublicIp = checklist.PublicIp,
                DeviceStatus = checklist.DeviceStatus,
                Signal = checklist.Signal,
                CameraStatus = checklist.CameraStatus,
                Battery = checklist.Battery,
                IsWFH = checklist.IsWFH,
                CreatedAt = checklist.CreatedAt,
                UpdatedAt = checklist.UpdatedAt
            };
        }
    }
}
