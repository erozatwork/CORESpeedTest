using CAS.FinancePortal.Web.Server.Core.Helpers;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.EmailService;
using CAS.FinancePortal.Web.Server.Core.ServiceLibraries;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;

namespace CAS.FinancePortal.Web.Server.Persistence.Helpers
{
	public class SendEmailHelper(
		IWebHostEnvironment webHostEnvironment,
		IConfiguration configuration, 
		IEmailService emailService,
		ICurrentApplicationUnitOfWork uoWForCurrentService


		) : ISendEmailHelper

	{
		private readonly IEmailService _emailService = emailService;
		private readonly ICurrentApplicationUnitOfWork _uniForCurrentService = uoWForCurrentService;
		private readonly string? _fileRootFolder = webHostEnvironment.IsDevelopment() ? webHostEnvironment.ContentRootPath : $"{configuration.GetSection("BaseFileLocation").Value}/";
		private readonly string? _urlRootDomain = configuration.GetSection("Domain").Value;

		
		 

		public async Task SendPageLink( List<string> emails)
		{
			var emailTemplatePath = Path.Combine(_fileRootFolder ?? string.Empty, "document_template", "EmailTemplate.html");

			var str = new StreamReader(emailTemplatePath);
			var mailText = str.ReadToEnd();
			str.Close();

			

		

			//
			mailText = mailText.Replace("[EmailTo]", "Hi ");
			mailText= mailText.Replace("[Subject]", "SHARED PAGE");
			mailText= mailText.Replace("[EmailBody]", "");


			var emailDto = new EmailDto()
			{
				SentTo = emails,
				Body = mailText,
				Subject = $""
			};


			await _emailService.SendEmailAsyncNew(emailDto);


		}

		
	}
}
