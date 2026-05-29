using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using CAS.FinancePortal.Web.Server.Persistence.Repositories;

namespace CAS.FinancePortal.Web.Server.Core.UnitOfWork;

public interface ICurrentApplicationUnitOfWork : IAsyncDisposable
{
	IDepartmentRepository DepartmentRepository { get; }
	IEmployeeRepository EmployeeRepository { get; }
	IChecklistRepository ChecklistRepository { get; }
	IMonitoringRepository MonitoringRepository { get; }
	Task BeginTransactionAsync(CancellationToken ct = default);
	Task<int> SaveChangesAsync(CancellationToken ct = default);
	Task ExecuteStrategyAsync(Func<Task> action);
	Task CommitAsync(CancellationToken ct = default);
	Task RollbackAsync(CancellationToken ct = default);
}
