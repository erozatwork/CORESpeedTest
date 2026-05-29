using System;

namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.SpeedTest
{
    /// <summary>
    /// Request DTO for speed test results
    /// </summary>
    public sealed record SpeedTestResultRequest(
        decimal DownloadMbps,
        decimal UploadMbps,
        decimal? LatencyMs,
        string PublicIp,
        string ClientBrowser,
        string ClientOs,
        string RawJson
    );

    /// <summary>
    /// Response DTO for stored speed test result
    /// </summary>
    public sealed record SpeedTestResultResponse(
        Guid Id,
        int EmployeeId,
        decimal DownloadMbps,
        decimal UploadMbps,
        decimal? LatencyMs,
        string PublicIp,
        string ClientBrowser,
        string ClientOs,
        DateTimeOffset MeasuredAtUtc,
        DateTimeOffset CreatedAtUtc
    );

    /// <summary>
    /// Speed test statistics DTO
    /// </summary>
    public sealed record SpeedTestStatsResponse(
        decimal AverageDownloadMbps,
        decimal AverageUploadMbps,
        decimal MaxDownloadMbps,
        decimal MinDownloadMbps,
        decimal MaxUploadMbps,
        decimal MinUploadMbps,
        int TestCount,
        DateTimeOffset? LastTestAtUtc
    );
}
