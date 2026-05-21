#nullable disable
namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.Service
{
	public class PdfInfoDto
	{
		public string Name { get; set; }
		public string Value { get; set; }
		public bool IsSignature { get; set; }
		public string ESignature { get; set; }
	}
}
