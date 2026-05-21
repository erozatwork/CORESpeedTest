using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
using CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Persistence.DbContext
{
	public class SuperApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext, ISuperApplicationDbContext
	{
        public SuperApplicationDbContext(DbContextOptions<SuperApplicationDbContext> options) : base(options)
        {
        }

		public DbSet<ApplicationSetting> ApplicationSettings { get; set; }
		public DbSet<CoreSystem> CoreSystems { get; set; }
		public DbSet<CoreSystemAccess> CoreSystemAccesses { get; set; }
		public DbSet<ClientInformation> ClientInformations { get; set; }
		public DbSet<LoginCredential> LoginCredentials { get; set; }
		public DbSet<UserType> UserTypes { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.ApplyConfiguration(new ApplicationSettingConfig());
			modelBuilder.ApplyConfiguration(new CoreSystemConfig());
			modelBuilder.ApplyConfiguration(new CoreSystemAccessConfig());
			modelBuilder.ApplyConfiguration(new ClientInformationConfig());
			modelBuilder.ApplyConfiguration(new LoginCredentialConfig());
			modelBuilder.ApplyConfiguration(new UserTypeConfig());

			base.OnModelCreating(modelBuilder);
		}
	}
}
