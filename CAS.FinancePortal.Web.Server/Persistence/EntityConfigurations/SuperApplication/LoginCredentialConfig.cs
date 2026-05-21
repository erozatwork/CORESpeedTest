using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class LoginCredentialConfig : IEntityTypeConfiguration<LoginCredential>
	{
		public void Configure(EntityTypeBuilder<LoginCredential> builder)
		{
			builder.ToTable("login_credentials");

			builder.Property(e => e.Id)
				.ValueGeneratedNever()
				.HasColumnName("id");
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("created_by");
			builder.Property(e => e.CreatedDate)
				.HasColumnType("datetime")
				.HasColumnName("created_date");
			builder.Property(e => e.IsActive)
				.HasDefaultValue(true)
				.HasColumnName("is_active");
			builder.Property(e => e.IsLockOut).HasColumnName("is_lock_out");
			builder.Property(e => e.LoginAttemps).HasColumnName("login_attemps");
			builder.Property(e => e.Password)
				.IsRequired()
				.HasColumnName("password");
			builder.Property(e => e.UserEmail)
				.IsRequired()
				.HasColumnName("user_email");
			builder.Property(e => e.UserReferenceId).HasColumnName("user_reference_id");
			builder.Property(e => e.UserType).HasColumnName("user_type");

			builder.HasOne(d => d.UserTypeNavigation).WithMany(p => p.LoginCredentials)
				.HasForeignKey(d => d.UserType)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_login_credentials_user_types_id");
		}
	}
}
