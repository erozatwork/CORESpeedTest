using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views;

public class VwEmployeeConfig : IEntityTypeConfiguration<VwEmployee>
{
	public void Configure(EntityTypeBuilder<VwEmployee> builder)
	{
        builder
                .HasNoKey()
                .ToView("Vw_Employees");

        builder.Property(e => e.CompanyEmail).HasMaxLength(50);
        builder.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(500);
        builder.Property(e => e.Gender)
            .IsRequired()
            .HasMaxLength(50);
        builder.Property(e => e.LastName)
            .IsRequired()
            .HasMaxLength(500);
        builder.Property(e => e.MobileNo)
            .IsRequired()
            .HasMaxLength(50);
        builder.Property(e => e.Tin)
            .HasMaxLength(50)
            .HasColumnName("TIN");
        builder.Property(e => e.YearId)
            .IsRequired()
            .HasMaxLength(50);
    }
}
