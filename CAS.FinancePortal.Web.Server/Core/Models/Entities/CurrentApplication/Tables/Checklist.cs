using System;
using System.Collections.Generic;

namespace CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;

public partial class Checklist
{
    public Guid ChecklistId { get; set; }

    public int EmployeeId { get; set; }

    public decimal? DownloadSpeed { get; set; }

    public decimal? UploadSpeed { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? Address { get; set; }

    public string? PublicIp { get; set; }

    public string? DeviceStatus { get; set; }

    public string? Signal { get; set; }

    public string? CameraStatus { get; set; }

    public int? Battery { get; set; }

    public bool? IsWFH { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual Employee? Employee { get; set; }
}
