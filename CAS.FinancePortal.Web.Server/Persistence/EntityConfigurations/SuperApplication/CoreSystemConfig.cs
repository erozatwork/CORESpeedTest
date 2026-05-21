using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class CoreSystemConfig : IEntityTypeConfiguration<CoreSystem>
	{
		public void Configure(EntityTypeBuilder<CoreSystem> builder)
		{
			builder.HasKey(e => e.SystemId).HasName("PK_systems");

			builder.ToTable("core_systems");

			builder.Property(e => e.SystemId).HasColumnName("system_id");
			builder.Property(e => e.CreatedBy)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("created_by");
			builder.Property(e => e.CreatedDate)
				.HasColumnType("datetime")
				.HasColumnName("created_date");
			builder.Property(e => e.SystemName)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("system_name");
			builder.Property(e => e.SystemUrl)
				.IsRequired()
				.HasMaxLength(50)
				.HasColumnName("system_url");

			builder.Property(e => e.Description)
				.HasColumnName("description");

			builder.Property(e => e.SystemIcon)
				.HasColumnName("system_icon");

		}
	}
}
