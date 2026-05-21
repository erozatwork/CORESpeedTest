using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.Repositories
{
	public class DepartmentRepository(CurrentApplicationDbContext dbContext) : IDepartmentRepository
	{
		public async Task<List<DropDownDto>> SelectOperationDepartmentsDropDown()
		{
			var departments = await dbContext.VwDepartments
				.AsNoTracking()
				.Where(w => w.DepartmentGroupId==2)
				.Select(s => new DropDownDto
				{
					Id = s.Id,
					Name = s.DepartmentName
				})
				.OrderBy(o => o.Name)
				.ToListAsync();

			return departments;
		}
	}
}
