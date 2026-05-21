using CAS.FinancePortal.Web.Server.Core.Models.Dtos.User;

namespace CAS.FinancePortal.Web.Server.Core.Applications;

public interface IUserAuthenticationService
{
	Task<(bool IsSuccess, int Status, string Message, List<UserSystemMenuDto> leftSideBarMenus)> LeftSideBarService(int userId);
	Task<(bool IsSuccess, int Status, string Message, List<string> resultData)> UserMenuRouteService(int userId);
	Task<(bool IsSuccess, int Status, string Message, UserDto resultData)> VerifyTokenService(int userId);
	Task<(bool IsSuccess, int Status, string Message, UserDto resultData)> VerifyTokenByEmailService(string email);
}