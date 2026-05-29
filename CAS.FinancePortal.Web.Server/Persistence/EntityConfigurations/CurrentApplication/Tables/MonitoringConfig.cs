using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
    /// <summary>
    /// EF Core configuration for the Monitoring entity
    /// </summary>
    public class MonitoringConfig : IEntityTypeConfiguration<Monitoring>
    {
        public void Configure(EntityTypeBuilder<Monitoring> builder)
        {
            builder.ToTable("Monitoring");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.EmployeeId)
                .IsRequired();

            builder.Property(m => m.EmployeeName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(m => m.Department)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(m => m.Location)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(m => m.DownloadSpeed)
                .HasPrecision(18, 2);

            builder.Property(m => m.UploadSpeed)
                .HasPrecision(18, 2);

            builder.Property(m => m.IpAddress)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(m => m.Latitude)
                .HasPrecision(18, 6);

            builder.Property(m => m.Longitude)
                .HasPrecision(18, 6);

            builder.Property(m => m.CreatedAtUtc)
                .IsRequired();

            // Foreign key to Employee
            builder.HasOne(m => m.Employee)
                .WithMany()
                .HasForeignKey(m => m.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Index for faster queries
            builder.HasIndex(m => m.EmployeeId);
            builder.HasIndex(m => m.CreatedAtUtc);
            builder.HasIndex(m => new { m.EmployeeId, m.CreatedAtUtc });
        }
    }
}
