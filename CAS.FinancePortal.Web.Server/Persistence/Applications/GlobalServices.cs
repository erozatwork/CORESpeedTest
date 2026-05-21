#nullable enable
using global::CAS.FinancePortal.Web.Server.Core.Applications;
using global::CAS.FinancePortal.Web.Server.Core.Models.Dtos.Global;
using global::CAS.FinancePortal.Web.Server.Core.Models.Dtos.Home;
using global::CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using global::CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace CAS.FinancePortal.Web.Server.Persistence.Applications
{
    public class GlobalServices : IGlobalServices
    {
        private readonly ICurrentApplicationUnitOfWork _uow;
        private readonly ILogger<GlobalServices> _logger;

        public GlobalServices(
            ICurrentApplicationUnitOfWork uow,
            ILogger<GlobalServices> logger)
        {
            _uow = uow;
            _logger = logger;
        }

        public async Task<(bool IsSuccess, int Status, string Message, List<DropDownDto> employees)> SelectEmployeeDropDownValues(int userId, int departmentId, int? teamId)
        {
            try
            {
                // Note: UserAccessRepository was removed as part of entity consolidation
                // Using provided departmentId directly
                var departmentValues = await _uow.EmployeeRepository.SelectEmployeesDropDown(departmentId, teamId);

                return (true, 200, "Successfully!", departmentValues);
            }
            catch (Exception e)
            {
                var errorMsg = $"Error occurred while fetching Employee Drop Down Values: {e.Message}";
                _logger.LogError(errorMsg);
                return (false, 400, errorMsg, new List<DropDownDto>());
            }
        }

        public async Task<(bool IsSuccess, int Status, string Message, HomeMenuCountDto homeMenuCount)> SelectHomeDashboardCount(int userId)
        {
            try
            {
                var homeMenuCount = new HomeMenuCountDto
                {
                    PendingRequestCount = 0,
                    PendingApprovalCount = 0,
                    OnLeaveCount = 0,
                    AbsenteeCount = 0,
                };

                return (true, 200, "Successfully!", homeMenuCount);
            }
            catch (Exception e)
            {
                var errorMsg = $"Error occurred while fetching Home Dashboard Count: {e.Message}";
                _logger.LogError(errorMsg);
                return (false, 400, errorMsg, new HomeMenuCountDto());
            }
        }
    }
}
