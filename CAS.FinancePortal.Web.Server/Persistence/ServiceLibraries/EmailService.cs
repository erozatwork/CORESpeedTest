using System.Net;
using System.Net.Mail;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.EmailService;
using CAS.FinancePortal.Web.Server.Core.Models.Enum.EmailService;
using CAS.FinancePortal.Web.Server.Core.ServiceLibraries;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;

namespace CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries
{
	public class EmailService(SuperApplicationDbContext dbContext) : IEmailService
	{
		public readonly SuperApplicationDbContext DbContext = dbContext;
		public async Task SendEmailAsyncNew(EmailDto email)
		{

			var smtpRequirements = new List<string>
			{
				SystemOptions.SmtpClientIp.ToString(),
				SystemOptions.SmtpClientHost.ToString(),
				SystemOptions.SmtpPort.ToString(),
				SystemOptions.SmtpEnableSsl.ToString(),
				SystemOptions.SmtpUseDefaultCredentials.ToString(),
				SystemOptions.SmtpUsername.ToString(),
				SystemOptions.SmtpPassword.ToString(),
				SystemOptions.SmtpMailAddress.ToString(),
				SystemOptions.SmtpMailDisplayName.ToString()
			};
			var smtpConfiguration = DbContext.ApplicationSettings.Where(x => smtpRequirements.Contains(x.Name)).ToList();
			var smtpClient = new SmtpClient(smtpConfiguration.First(x => x.Name == SystemOptions.SmtpClientIp.ToString()).Value)
			{
				DeliveryMethod = SmtpDeliveryMethod.Network,
				Port = Convert.ToInt32(smtpConfiguration.First(x => x.Name == SystemOptions.SmtpPort.ToString()).Value),
				EnableSsl = Convert.ToBoolean(smtpConfiguration.First(x => x.Name == SystemOptions.SmtpEnableSsl.ToString()).Value),
				UseDefaultCredentials =
					Convert.ToBoolean(smtpConfiguration.First(x => x.Name == SystemOptions.SmtpUseDefaultCredentials.ToString()).Value),
				Host = smtpConfiguration.First(x => x.Name == SystemOptions.SmtpClientHost.ToString()).Value,
				Credentials = new NetworkCredential(smtpConfiguration.First(x => x.Name == SystemOptions.SmtpUsername.ToString()).Value,
					smtpConfiguration.First(x => x.Name == SystemOptions.SmtpPassword.ToString()).Value)
			};

			var sender = new MailAddress(
				smtpConfiguration.First(x => x.Name == SystemOptions.SmtpMailAddress.ToString()).Value,
				smtpConfiguration.First(x => x.Name == SystemOptions.SmtpMailDisplayName.ToString()).Value
			);

			var message = new MailMessage { From = sender };
			message.To.Add(string.Join(",", email.SentTo));
			if (email.SendCc != null) message.CC.Add(string.Join(",", email.SendCc));
			if (email.SendBcc != null) message.Bcc.Add(string.Join(",", email.SendBcc));
			if (email.Attachment != null)
			{
				foreach (var file in email.Attachment)
				{
					message.Attachments.Add(new Attachment(string.Join(",", file)));
				}
			}

			message.Subject = email.Subject;
			message.IsBodyHtml = true;
			message.Body = email.Body;
			try
			{
				await smtpClient.SendMailAsync(message);
			}
			catch
			{
				throw new Exception("Failed to send the email.");
			}
		}
	}
}
