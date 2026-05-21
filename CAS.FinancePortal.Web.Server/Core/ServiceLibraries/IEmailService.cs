using CAS.FinancePortal.Web.Server.Core.Models.Dtos.EmailService;

namespace CAS.FinancePortal.Web.Server.Core.ServiceLibraries;

public interface IEmailService
{
	Task SendEmailAsyncNew(EmailDto email);
}