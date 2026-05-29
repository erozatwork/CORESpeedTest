using CAS.FinancePortal.Web.Server.Core;
using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Checklist;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.Repositories
{
    public class ChecklistRepository(ICurrentApplicationDbContext context) : GenericRepository<Checklist>(context), IChecklistRepository
    {
        private readonly DbSet<Checklist> _dbSet = ((Microsoft.EntityFrameworkCore.DbContext)context).Set<Checklist>();

        public async Task<ChecklistDto?> GetChecklistTodayByEmployeeAsync(int employeeId)
        {
            var today = PhilippinesTime.Today;
            
            var checklist = await _dbSet
                .Where(c => c.EmployeeId == employeeId && c.CreatedAt.Date == today)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            if (checklist == null)
                return null;

            return MapToDto(checklist);
        }

        public async Task<List<ChecklistDto>> GetChecklistHistoryByEmployeeAsync(int employeeId, int days = 30)
        {
            var startDate = PhilippinesTime.Now.AddDays(-days);

            var checklists = await _dbSet
                .Where(c => c.EmployeeId == employeeId && c.CreatedAt >= startDate)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return checklists.Select(MapToDto).ToList();
        }

        public async Task<ChecklistDto?> GetChecklistByIdAsync(Guid checklistId)
        {
            var checklist = await _dbSet
                .FirstOrDefaultAsync(c => c.ChecklistId == checklistId);

            return checklist == null ? null : MapToDto(checklist);
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
