using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class ClientInformationConfig : IEntityTypeConfiguration<ClientInformation>
	{
		public void Configure(EntityTypeBuilder<ClientInformation> builder)
		{
			builder.ToTable("client_informations");

			builder.Property(e => e.Id).HasColumnName("id");
			builder.Property(e => e.ClientDepartment).HasColumnName("client_department");
			builder.Property(e => e.CompanyName)
				.HasMaxLength(500)
				.HasColumnName("company_name");
			builder.Property(e => e.EmailAddress)
				.HasMaxLength(500)
				.HasColumnName("email_address");
			builder.Property(e => e.FirstName)
				.HasMaxLength(500)
				.HasColumnName("first_name");
			builder.Property(e => e.IsActive).HasColumnName("is_active");
			builder.Property(e => e.LastName)
				.HasMaxLength(500)
				.HasColumnName("last_name");
		}
	}
}
