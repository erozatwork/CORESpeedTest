using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views;

public class VwDepartmentConfig : IEntityTypeConfiguration<VwDepartment>
{
	public void Configure(EntityTypeBuilder<VwDepartment> builder)
	{
        builder
               .HasNoKey()
               .ToView("Vw_Departments");

        builder.Property(e => e.Alias).HasMaxLength(500);
        builder.Property(e => e.CreatedBy).HasMaxLength(50);
        builder.Property(e => e.CreatedDate).HasColumnType("datetime");
        builder.Property(e => e.DepartmentName)
            .IsRequired()
            .HasMaxLength(1000);
        builder.Property(e => e.TimeDifferenceMnl).HasMaxLength(6);
        builder.Property(e => e.Timezone).HasMaxLength(255);
    }
}
