namespace CAS.FinancePortal.Web.Server.Core.Models.Components
{
	public class DataTableResponseDto<T>
	{
		public string? Draw { get; set; }
		public int RecordsTotal { get; set; }
		public int RecordsFiltered { get; set; }
		public List<T> Data { get; set; } = [];
	}
}
