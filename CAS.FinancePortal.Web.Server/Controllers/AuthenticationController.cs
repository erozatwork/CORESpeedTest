using CAS.FinancePortal.Web.Server.Core.Applications;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CAS.FinancePortal.Web.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthenticationController(IUserAuthenticationService authenticationServices) : ControllerBase
	{
		private readonly IUserAuthenticationService _authenticationServices = authenticationServices;

		[AllowAnonymous]
		[HttpGet("verify_token")]
		public async Task<IActionResult> VerifyToken()
		{
			try
			{
				if (User.Identity?.IsAuthenticated != true)
					return Unauthorized();

				var identifier = User.FindFirst("user_id")?.Value
					?? User.FindFirst("email")?.Value
					?? User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
					?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

				// Determine whether the claim is an email address or a numeric user ID
				(bool IsSuccess, int Status, string Message, Core.Models.Dtos.User.UserDto resultData) userLogged;

				if (!string.IsNullOrEmpty(identifier) && identifier.Contains('@'))
				{
					// Email-based claim (bypass / external token scenario)
					userLogged = await _authenticationServices.VerifyTokenByEmailService(identifier);
				}
				else if (!string.IsNullOrEmpty(identifier) && int.TryParse(identifier, out var parsedId))
				{
					// Numeric user_id claim (standard login token)
					userLogged = await _authenticationServices.VerifyTokenService(parsedId);
				}
				else
				{
					return BadRequest("Invalid user identifier in token");
				}

				// Return both names for compatibility across different modules
				return Ok(new 
				{ 
					success = true,
					responseText = "Retrieved successfully",
					resultData = userLogged.resultData,
					responseDto = userLogged.resultData 
				});

			}
			catch (Exception e)
			{
				return new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
			}

		}

		[Authorize]
		[HttpGet("user_menus")]
		public async Task<IActionResult> UsersMenus()
		{
			try
			{
				if (User.Identity?.IsAuthenticated != true)
					return Unauthorized();

				var userIdStr = User.FindFirst("user_id")?.Value
					?? User.FindFirst("nameid")?.Value
					?? User.FindFirst("sub")?.Value
					?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
				var userId = Convert.ToInt32(userIdStr);

				var result = await _authenticationServices.LeftSideBarService(userId);

				return new JsonResult(new { result.leftSideBarMenus })
				{
					StatusCode = result.Status
				};

			}
			catch (Exception e)
			{
				return new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
			}


		}

		[Authorize]
		[HttpGet("user_menu_paths")]
		public async Task<IActionResult> UserMenuPaths()
		{
			try
			{
				if (User.Identity?.IsAuthenticated != true)
					return Unauthorized();

				var userIdStr = User.FindFirst("user_id")?.Value
					?? User.FindFirst("nameid")?.Value
					?? User.FindFirst("sub")?.Value
					?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
				var userId = Convert.ToInt32(userIdStr);

				var result = await _authenticationServices.UserMenuRouteService(userId);

				return new JsonResult(new { result.resultData })
				{
					StatusCode = result.Status
				};

			}
			catch (Exception e)
			{
				return new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
			}


		}

		[HttpGet]
		[Route("test")]
		public async Task<IActionResult> Test()
		{
			var userLogged = await _authenticationServices.VerifyTokenService(9);
			return Ok(userLogged);
		}

	}
}
