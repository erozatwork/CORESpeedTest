namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.EmailService
{
	public class EmailDto
	{
		public List<string> SentTo { get; set; }
		public List<string>? SendCc { get; set; }
		public List<string>? SendBcc { get; set; }
		public string Subject { get; set; }
		public string Body { get; set; }
		public string From { get; set; }
		public string DisplayName { get; set; }
		public List<string>? Attachment { get; set; }
	}
}
