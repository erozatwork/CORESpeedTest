using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Views;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.DbContext
{
    public class CurrentApplicationDbContext(DbContextOptions<CurrentApplicationDbContext> options) : Microsoft.EntityFrameworkCore.DbContext(options), ICurrentApplicationDbContext
    {
        public DbSet<VwCombinedUserInformation> VwCombinedUserInformations { get; set; }
        public DbSet<VwDepartment> VwDepartments { get; set; }
        public DbSet<VwEmployee> VwEmployees { get; set; }
        public DbSet<VwPayeeProfile> VwPayeeProfiles { get; set; }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new VwCombinedUserInformationConfig());
            modelBuilder.ApplyConfiguration(new VwDepartmentConfig());
            modelBuilder.ApplyConfiguration(new VwEmployeeConfig());
            modelBuilder.ApplyConfiguration(new VwPayeeProfileConfig());

            modelBuilder.ApplyConfiguration(new DepartmentConfig());
            modelBuilder.ApplyConfiguration(new EmployeeConfig());
            modelBuilder.ApplyConfiguration(new LocationConfig());

            base.OnModelCreating(modelBuilder);
        }
    }
}
