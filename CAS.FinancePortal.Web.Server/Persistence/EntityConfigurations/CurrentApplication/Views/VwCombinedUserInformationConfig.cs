using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Views;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views
{
	public class VwCombinedUserInformationConfig : IEntityTypeConfiguration<VwCombinedUserInformation>
	{
		public void Configure(EntityTypeBuilder<VwCombinedUserInformation> builder)
		{
			builder
				.ToTable("vw_combined_user_informations");
			builder.HasKey(e => e.UserId);

			builder.Property(e => e.FirstName)
				.HasMaxLength(500)
				.HasColumnName("first_name");
			builder.Property(e => e.IsActive).HasColumnName("is_active");
			builder.Property(e => e.IsLockOut).HasColumnName("is_lock_out");
			builder.Property(e => e.LastName)
				.HasMaxLength(500)
				.HasColumnName("last_name");
			builder.Property(e => e.LoginAttemps).HasColumnName("login_attemps");
			builder.Property(e => e.Password)
				.IsRequired()
				.HasColumnName("password");
			builder.Property(e => e.UserEmail)
				.IsRequired()
				.HasColumnName("user_email");
			builder.Property(e => e.UserId).HasColumnName("user_id");
			builder.Property(e => e.UserReferenceId).HasColumnName("user_reference_id");
			builder.Property(e => e.UserType).HasColumnName("user_type");
		}
	}
}
