using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
using Microsoft.EntityFrameworkCore;

namespace CAS.FinancePortal.Web.Server.Core.DbContext;

public interface ISuperApplicationDbContext
{
	DbSet<ApplicationSetting> ApplicationSettings { get; set; }
	DbSet<CoreSystem> CoreSystems { get; set; }

	DbSet<CoreSystemAccess> CoreSystemAccesses { get; set; }

	DbSet<ClientInformation> ClientInformations { get; set; }

	DbSet<LoginCredential> LoginCredentials { get; set; }

	DbSet<UserType> UserTypes { get; set; }

}