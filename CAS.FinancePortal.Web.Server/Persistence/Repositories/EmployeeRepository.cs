using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
{
private readonly CurrentApplicationDbContext dbContext;

public EmployeeRepository(CurrentApplicationDbContext dbContext)
{
this.dbContext = dbContext;
}

public async Task<List<DropDownDto>> SelectEmployeesDropDown(int departmentId, int? teamId)
{
var query = dbContext.VwEmployees
.Where(w => w.IsActive)
.AsNoTracking();

if (departmentId != 0)
query = query.Where(w => w.DepartmentId == departmentId);

var departments = await query
.Select(s => new DropDownDto()
{
Id = s.EmployeeId,
Name = s.FirstName + " " + s.LastName
})
.OrderBy(o => o.Name)
.ToListAsync();

return departments;
}

public async Task<int?> GetEmployeeIdBasedOnName(int id)
{
var query = await dbContext.VwEmployees
.AsNoTracking()
.FirstOrDefaultAsync(w => w.EmployeeId == id);

return query?.EmployeeId;
}
}
}
