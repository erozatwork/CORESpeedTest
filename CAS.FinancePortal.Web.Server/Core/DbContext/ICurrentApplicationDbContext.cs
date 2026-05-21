
using Microsoft.EntityFrameworkCore;


namespace CAS.FinancePortal.Web.Server.Core.DbContext;

public interface ICurrentApplicationDbContext
{
	DbSet<VwCombinedUserInformation> VwCombinedUserInformations { get; set; }
	DbSet<VwDepartment> VwDepartments { get; set; }
    DbSet<VwEmployee> VwEmployees { get; set; }
	DbSet<VwPayeeProfile> VwPayeeProfiles { get; set; }

	DbSet<Department> Departments { get; set; }

	DbSet<Employee> Employees { get; set; }

	DbSet<Location> Locations { get; set; }

	Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}