#nullable disable
namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.Service
{
	public class PdfDto
	{
		public string FolderPath { get; set; }
		public List<PdfInfoDto> PdfInfos { get; set; }
		public string FileName { get; set; }
		public string OriginFileName { get; set; }
	}
}
