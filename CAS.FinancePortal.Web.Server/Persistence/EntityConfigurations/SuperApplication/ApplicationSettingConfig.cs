using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.SuperApplication
{
	public class ApplicationSettingConfig : IEntityTypeConfiguration<ApplicationSetting>
	{
		public void Configure(EntityTypeBuilder<ApplicationSetting> builder)
		{
			builder.HasKey(e => e.Id).HasName("PK_idbuilder_settings");

			builder.ToTable("application_settings");

			builder.Property(e => e.Id).HasColumnName("id");
			builder.Property(e => e.IsActive)
				.HasDefaultValue(true)
				.HasColumnName("is_active");
			builder.Property(e => e.Name)
				.IsRequired()
				.HasColumnName("name");
			builder.Property(e => e.Value)
				.IsRequired()
				.HasColumnName("value");
		}
	}
}
