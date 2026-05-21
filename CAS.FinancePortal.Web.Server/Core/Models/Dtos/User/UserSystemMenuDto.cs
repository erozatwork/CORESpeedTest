#nullable disable
namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.User
{
	public class UserSystemMenuDto
	{
		public int MenuId { get; set; }
		public string MenuName { get; set; }
		public string Path { get; set; }
		public string Icon { get; set; }
		public int? ParentId { get; set; }
		public bool? IsParent { get; set; }
		public bool? IsSubParent { get; set; }

		public List<UserSystemMenuDto>  SubMenus { get; set; }
}
}
