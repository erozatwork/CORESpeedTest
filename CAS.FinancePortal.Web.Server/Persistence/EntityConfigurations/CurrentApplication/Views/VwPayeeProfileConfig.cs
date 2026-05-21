using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views;

public class VwPayeeProfileConfig : IEntityTypeConfiguration<VwPayeeProfile>
{
	public void Configure(EntityTypeBuilder<VwPayeeProfile> builder)
	{
        builder
              .HasNoKey()
              .ToView("Vw_PayeeProfiles");

        builder.Property(e => e.FullName)
            .IsRequired()
            .HasMaxLength(1001);
        builder.Property(e => e.PayeeType)
            .IsRequired()
            .HasMaxLength(8)
            .IsUnicode(false);
        builder.Property(e => e.PayeeeId)
            .IsRequired()
            .HasMaxLength(14)
            .IsUnicode(false);
        builder.Property(e => e.Tin)
            .HasMaxLength(50)
            .HasColumnName("TIN");
    }
}
