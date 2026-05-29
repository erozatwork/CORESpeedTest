using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
    public class ChecklistConfig : IEntityTypeConfiguration<Checklist>
    {
        public void Configure(EntityTypeBuilder<Checklist> builder)
        {
            builder.ToTable("Checklist");

            builder.HasKey(e => e.ChecklistId);

            builder.Property(e => e.ChecklistId)
                .HasDefaultValueSql("NEWID()");

            builder.Property(e => e.EmployeeId)
                .IsRequired();

            builder.Property(e => e.DownloadSpeed)
                .HasPrecision(10, 2);

            builder.Property(e => e.UploadSpeed)
                .HasPrecision(10, 2);

            builder.Property(e => e.Latitude)
                .HasPrecision(18, 8);

            builder.Property(e => e.Longitude)
                .HasPrecision(18, 8);

            builder.Property(e => e.Address)
                .HasMaxLength(500);

            builder.Property(e => e.PublicIp)
                .HasMaxLength(50)
                .HasDefaultValue("online");

            builder.Property(e => e.DeviceStatus)
                .HasMaxLength(50)
                .HasDefaultValue("online");

            builder.Property(e => e.Signal)
                .HasMaxLength(50)
                .HasDefaultValue("strong");

            builder.Property(e => e.CameraStatus)
                .HasMaxLength(50)
                .HasDefaultValue("offline");

            builder.Property(e => e.Battery)
                .HasDefaultValue(100);

            builder.Property(e => e.IsWFH)
                .HasDefaultValue(true);

            builder.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign key relationship
            builder.HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(e => e.EmployeeId);
            builder.HasIndex(e => e.CreatedAt);
        }
    }
}
