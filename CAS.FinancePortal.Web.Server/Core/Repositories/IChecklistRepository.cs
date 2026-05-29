using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Checklist;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;

namespace CAS.FinancePortal.Web.Server.Core.Repositories;

public interface IChecklistRepository : IGenericRepository<Checklist>
{
    Task<ChecklistDto?> GetChecklistTodayByEmployeeAsync(int employeeId);
    Task<List<ChecklistDto>> GetChecklistHistoryByEmployeeAsync(int employeeId, int days = 30);
    Task<ChecklistDto?> GetChecklistByIdAsync(Guid checklistId);
}
