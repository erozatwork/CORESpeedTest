using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Home;

namespace CAS.FinancePortal.Web.Server.Core.Applications;

public interface IGlobalServices
{
	Task<(bool IsSuccess, int Status, string Message, List<DropDownDto> employees)> SelectEmployeeDropDownValues(int userId, int departmentId, int? teamId);
	
	Task<(bool IsSuccess, int Status, string Message, HomeMenuCountDto homeMenuCount)> SelectHomeDashboardCount(int userId);
}