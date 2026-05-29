using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Checklist;

namespace CAS.FinancePortal.Web.Server.Core.Applications
{
    public interface IChecklistService
    {
        Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> CreateChecklistAsync(CreateChecklistDto createChecklistDto);
        Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> GetChecklistTodayAsync(int employeeId);
        Task<(bool IsSuccess, int Status, string Message, List<ChecklistDto>? Data)> GetChecklistHistoryAsync(int employeeId, int days = 30);
        Task<(bool IsSuccess, int Status, string Message, ChecklistDto? Data)> UpdateChecklistAsync(Guid checklistId, CreateChecklistDto updateChecklistDto);
        Task<(bool IsSuccess, int Status, string Message)> DeleteChecklistAsync(Guid checklistId);
        Task<(bool IsSuccess, int Status, string Message, dynamic? Data)> GetChecklistStatsAsync(int employeeId);
    }
}
