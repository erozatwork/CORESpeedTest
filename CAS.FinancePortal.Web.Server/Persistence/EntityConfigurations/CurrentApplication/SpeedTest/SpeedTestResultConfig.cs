using CAS.FinancePortal.Web.Server.Core.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.SpeedTest
{
    public class SpeedTestResultConfig : IEntityTypeConfiguration<SpeedTestResult>
    {
        public void Configure(EntityTypeBuilder<SpeedTestResult> builder)
        {
            builder.ToTable("SpeedTestResults");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.DownloadMbps)
                .HasPrecision(18, 2);

            builder.Property(e => e.UploadMbps)
                .HasPrecision(18, 2);

            builder.Property(e => e.LatencyMs)
                .HasPrecision(18, 2);
        }
    }
}