using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Persistence.Applications;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;

namespace CAS.FinancePortal.Web.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GlobalController : ControllerBase
	{
		private readonly IGlobalServices _globalServices;

        public GlobalController(IGlobalServices globalServices)
        {
            _globalServices = globalServices;
        }


		[Authorize]
		[HttpGet("employees_dropdown/{departmentId:int}")]
		public async Task<IActionResult> EmployeesDropDown(int departmentId, [FromQuery] int? teamId = null)
		{
			try
			{
				var userId = Convert.ToInt32(User.FindFirst("user_id")?.Value);
				var result = await _globalServices.SelectEmployeeDropDownValues(userId, departmentId, teamId);

				return new JsonResult(new { result.employees })
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


		//[AllowAnonymous]
		//[HttpGet("multiple_employees_dropdown")]
		//public async Task<IActionResult> MultipleEmployeesDropDown([FromQuery] int[] departmentId, [FromQuery] int[]? teamId = null)
		//{
		//	try
		//	{
		//		var userId = Convert.ToInt32(User.FindFirst("user_id")?.Value);
		//		var result = await _globalServices.SelectMultipleEmployeeDropDownValues(userId, departmentId, teamId);

		//		return new JsonResult(new { result.employees })
		//		{
		//			StatusCode = result.Status
		//		};

		//	}
		//	catch (Exception e)
		//	{
		//		return new JsonResult(new { success = false, responseText = e.Message })
		//		{
		//			StatusCode = 400
		//		};
		//	}


		//}

        [AllowAnonymous]
        [HttpGet("locations_dropdown")]
        public async Task<IActionResult> LocationsDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }
        [AllowAnonymous]
        [HttpGet("offices_dropdown")]
        public async Task<IActionResult> OfficesDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }

        [AllowAnonymous]
        [HttpGet("request_types_dropdown")]
        public async Task<IActionResult> RequestTypesDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }

        [AllowAnonymous]
        [HttpGet("payee_dropdown")]
        public async Task<IActionResult> PayeeDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }

        [AllowAnonymous]
        [HttpGet("tax_basis_dropdown")]
        public async Task<IActionResult> TaxBasisDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }

        [AllowAnonymous]
        [HttpGet("vat_types_dropdown")]
        public async Task<IActionResult> VatTypesDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }

        [AllowAnonymous]
        [HttpGet("ewt_types_dropdown")]
        public async Task<IActionResult> EwtTypesDropDown()
        {
            return new JsonResult(new { success = false, message = "Not available" }) { StatusCode = 400 };
        }
        [AllowAnonymous]
        [HttpPost("compute_tax")]
        public async Task<IActionResult> ComputeTax()
        {
            try
            {
                return new JsonResult(new { success = false, message = "This endpoint is not available" }) { StatusCode = 400 };
            }
            catch (Exception e)
            {
                return new JsonResult(new { success = false, message = e.Message }) { StatusCode = 400 };
            }
        }
    }
}
