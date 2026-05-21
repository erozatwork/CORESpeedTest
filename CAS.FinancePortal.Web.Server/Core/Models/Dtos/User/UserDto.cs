#nullable disable
namespace CAS.FinancePortal.Web.Server.Core.Models.Dtos.User
{
	public class UserDto
	{
		public int UserId { get; set; }
		public int ReferenceId { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string FullName => $"{FirstName} {LastName}";
		public int DepartmentId { get; set; }
		public string DepartmentName { get; set; }
		public int UserAccessId { get; set; }
		public List<UserSystemMenuDto> Menus { get; set; }
	}
}
