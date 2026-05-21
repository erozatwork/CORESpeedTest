using CAS.FinancePortal.Web.Server.Core.Applications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CAS.FinancePortal.Web.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HomeController(IGlobalServices globalServices) : ControllerBase
	{
		private readonly IGlobalServices _globalServices = globalServices;


		[Authorize]
		[HttpGet("home_menu_count")]
		public async Task<IActionResult> SelectHomeMenuCount()
		{
			JsonResult jsonResult;
			try
			{
				jsonResult = new JsonResult(new { success = false, message = "Not available" })
				{
					StatusCode = 400
				};
				return jsonResult;

			}
			catch (Exception e)
			{
				jsonResult = new JsonResult(new { success = false, responseText = e.Message })
				{
					StatusCode = 400
				};
				return jsonResult;
			}


		}
	}
}
