using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;

namespace CAS.FinancePortal.Web.Server.Core.Repositories;

public interface IDepartmentRepository
{
	Task<List<DropDownDto>> SelectOperationDepartmentsDropDown();
}
