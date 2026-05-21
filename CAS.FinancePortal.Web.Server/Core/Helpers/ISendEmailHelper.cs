namespace CAS.FinancePortal.Web.Server.Core.Helpers;

public interface ISendEmailHelper
{
	Task SendPageLink(List<string> emails);
}