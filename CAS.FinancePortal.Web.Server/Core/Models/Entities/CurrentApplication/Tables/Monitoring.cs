using System;

namespace CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;

/// <summary>
/// Monitoring table logs all employee activity using the checklist system.
/// Captures employee identity, network performance, and location data at each save event.
/// </summary>
public partial class Monitoring
{
    /// <summary>
    /// Unique identifier for the monitoring record
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Employee who performed the checklist action
    /// </summary>
    public int EmployeeId { get; set; }

    /// <summary>
    /// Employee full name (denormalized for quick reporting)
    /// </summary>
    public string EmployeeName { get; set; } = string.Empty;

    /// <summary>
    /// Department of the employee (denormalized for quick reporting)
    /// </summary>
    public string Department { get; set; } = string.Empty;

    /// <summary>
    /// Location where the checklist was submitted (address or coordinates)
    /// </summary>
    public string Location { get; set; } = string.Empty;

    /// <summary>
    /// Download speed in Mbps at the time of submission
    /// </summary>
    public decimal? DownloadSpeed { get; set; }

    /// <summary>
    /// Upload speed in Mbps at the time of submission
    /// </summary>
    public decimal? UploadSpeed { get; set; }

    /// <summary>
    /// Public IP address detected during the submission
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;

    /// <summary>
    /// Latitude of the location
    /// </summary>
    public decimal? Latitude { get; set; }

    /// <summary>
    /// Longitude of the location
    /// </summary>
    public decimal? Longitude { get; set; }

    /// <summary>
    /// When the record was created (Philippines local time, UTC+8)
    /// </summary>
    public DateTime CreatedAtUtc { get; set; }

    /// <summary>
    /// Navigation property to Employee
    /// </summary>
    public virtual Employee? Employee { get; set; }
}
