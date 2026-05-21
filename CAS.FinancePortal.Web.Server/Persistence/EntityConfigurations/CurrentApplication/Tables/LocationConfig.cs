using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
    public class LocationConfig : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.Property(e => e.Address)
                  .IsRequired()
                  .HasMaxLength(255);
            builder.Property(e => e.CreatedDate).HasColumnType("datetime");
            builder.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasAnnotation("Relational:DefaultConstraintName", "DF_Locations_IsActive");
            builder.Property(e => e.Location1)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("Location");
        }
    }
}
