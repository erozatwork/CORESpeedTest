using System;

namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.Monitoring;

/// <summary>
/// DTO for creating a monitoring record
/// </summary>
public class CreateMonitoringDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? DownloadSpeed { get; set; }
    public decimal? UploadSpeed { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}

/// <summary>
/// DTO for responding with monitoring data
/// </summary>
public class MonitoringDto
{
    public Guid Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? DownloadSpeed { get; set; }
    public decimal? UploadSpeed { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

/// <summary>
/// DTO for monitoring statistics
/// </summary>
public class MonitoringStatsDto
{
    public int TotalRecords { get; set; }
    public int UniqueEmployees { get; set; }
    public DateTime? OldestRecord { get; set; }
    public DateTime? LatestRecord { get; set; }
    public decimal? AverageDownloadSpeed { get; set; }
    public decimal? AverageUploadSpeed { get; set; }
}

/// <summary>
/// DTO for employees who are still pending a checklist submission for today.
/// </summary>
public class PendingMonitoringEmployeeDto
{
    public int EmployeeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}
