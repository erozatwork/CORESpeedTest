namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.Home;

public class HomeMenuCountDto
{
    public int PendingRequestCount { get; set; }
    public int PendingApprovalCount { get; set; }
    public int OnLeaveCount { get; set; }
    public int AbsenteeCount { get; set; }
}
