using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class UserTypeConfig : IEntityTypeConfiguration<UserType>
	{
		public void Configure(EntityTypeBuilder<UserType> builder)
		{
			builder.ToTable("user_types");

			builder.Property(e => e.Id).HasColumnName("id");
			builder.Property(e => e.UserTypeName)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("user_type_name");
		}
	}
}
