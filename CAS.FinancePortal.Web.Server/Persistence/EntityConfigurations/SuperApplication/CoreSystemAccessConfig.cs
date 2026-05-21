using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class CoreSystemAccessConfig : IEntityTypeConfiguration<CoreSystemAccess>
	{
		public void Configure(EntityTypeBuilder<CoreSystemAccess> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_system_access");

			builder.ToTable("core_system_access");

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
			builder.Property(e => e.IsActive).HasColumnName("is_active");
			builder.Property(e => e.SystemId).HasColumnName("system_id");
			builder.Property(e => e.UserId).HasColumnName("user_id");

			builder.HasOne(d => d.System).WithMany(p => p.CoreSystemAccesses)
				.HasForeignKey(d => d.SystemId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_system_access_core_systems_system_id");

			builder.HasOne(d => d.User).WithMany(p => p.CoreSystemAccesses)
				.HasForeignKey(d => d.UserId)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK_core_system_access_login_credentials_id");
		}
	}
}
