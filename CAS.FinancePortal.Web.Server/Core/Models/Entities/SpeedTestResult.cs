using System;

namespace CAS.FinancePortal.Web.Server.Core.Models.Entities
{
    /// <summary>
    /// Speed test result entity for storing network performance measurements
    /// </summary>
    public class SpeedTestResult
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Employee who ran the test
        /// </summary>
        public int EmployeeId { get; set; }

        /// <summary>
        /// Download speed in Mbps
        /// </summary>
        public decimal DownloadMbps { get; set; }

        /// <summary>
        /// Upload speed in Mbps
        /// </summary>
        public decimal UploadMbps { get; set; }

        /// <summary>
        /// Latency/ping in milliseconds
        /// </summary>
        public decimal? LatencyMs { get; set; }

        /// <summary>
        /// Public IP address detected during test
        /// </summary>
        public string PublicIp { get; set; } = string.Empty;

        /// <summary>
        /// Client browser information
        /// </summary>
        public string ClientBrowser { get; set; } = string.Empty;

        /// <summary>
        /// Client operating system
        /// </summary>
        public string ClientOs { get; set; } = string.Empty;

        /// <summary>
        /// Raw test data as JSON for future analysis
        /// </summary>
        public string RawJson { get; set; } = string.Empty;

        /// <summary>
        /// When the test was measured (UTC)
        /// </summary>
        public DateTimeOffset MeasuredAtUtc { get; set; } = DateTimeOffset.UtcNow;

        /// <summary>
        /// When the result was stored (UTC)
        /// </summary>
        public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    }
}
