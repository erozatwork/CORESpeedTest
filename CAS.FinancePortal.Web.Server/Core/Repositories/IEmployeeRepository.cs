using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;

namespace CAS.FinancePortal.Web.Server.Core.Repositories;

public interface IEmployeeRepository
{
	Task<List<DropDownDto>> SelectEmployeesDropDown(int departmentId, int? teamId);
	Task<int?> GetEmployeeIdBasedOnName(int id);
}
