using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.User;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace CAS.FinancePortal.Web.Server.Persistence.Applications
{
public class UserAuthenticationService (
ICurrentApplicationUnitOfWork uowCurrentApplicationApplication,
ILogger<UserAuthenticationService> logger
) : IUserAuthenticationService
{

private readonly ICurrentApplicationUnitOfWork _uowCurrentApplicationApplication = uowCurrentApplicationApplication;
private readonly ILogger<UserAuthenticationService> _logger = logger;


public async Task<(bool IsSuccess, int Status, string Message, UserDto resultData)> VerifyTokenService(int userId)
{
try
{
// Service not available with minimal configuration
return (false, 400, $"Service not available",(UserDto)null!);
}
catch (Exception e)
{
_logger.LogError($"Error: {e.Message}");
return (false, 400, $"Error: {e.Message}", null)!;
}
}

public async Task<(bool IsSuccess, int Status, string Message, UserDto resultData)> VerifyTokenByEmailService(string email)
{
try
{
// Service not available with minimal configuration
return (false, 400, $"Service not available",(UserDto)null!);
}
catch (Exception e)
{
_logger.LogError($"Error: {e.Message}");
return (false, 400, $"Error: {e.Message}", null)!;
}
}

public async Task<(bool IsSuccess, int Status, string Message, List<UserSystemMenuDto> leftSideBarMenus)> LeftSideBarService(int userId)
{
try
{
// Service not available with minimal configuration
return (false, 400, $"Service not available", []);
}
catch (Exception e)
{
_logger.LogError($"Error: {e.Message}");
return (false, 400, $"Error: {e.Message}", []);
}
}

public async Task<(bool IsSuccess, int Status, string Message, List<string> resultData)> UserMenuRouteService(int userId)
{
try
{
// Service not available with minimal configuration
return (false, 400, $"Service not available", []);
}
catch (Exception e)
{
_logger.LogError($"Error: {e.Message}");
return (false, 400, $"Error: {e.Message}", []);
}
}
}
}
