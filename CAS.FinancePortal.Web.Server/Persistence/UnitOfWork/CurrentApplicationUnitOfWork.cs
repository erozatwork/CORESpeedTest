using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using CAS.FinancePortal.Web.Server.Core.Repositories;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;
using CAS.FinancePortal.Web.Server.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace CAS.FinancePortal.Web.Server.Persistence.UnitOfWork;

public sealed class CurrentApplicationUnitOfWork(CurrentApplicationDbContext db) : ICurrentApplicationUnitOfWork
{
	private IDbContextTransaction? _tx;
	private bool _done;
	public IDepartmentRepository DepartmentRepository { get; } = new DepartmentRepository(db);
	public IEmployeeRepository EmployeeRepository { get; } = new EmployeeRepository(db);
	public IChecklistRepository ChecklistRepository { get; } = new ChecklistRepository(db);
	public IMonitoringRepository MonitoringRepository { get; } = new MonitoringRepository(db);

	public async Task BeginTransactionAsync(CancellationToken ct = default)
	{
		if (_tx is null) _tx = await db.Database.BeginTransactionAsync(ct);
		_done = false;
	}

	public Task ExecuteStrategyAsync(Func<Task> action)
	{
		var strategy = db.Database.CreateExecutionStrategy();
		return strategy.ExecuteAsync(action);
	}

	public Task<int> SaveChangesAsync(CancellationToken ct = default) => db.SaveChangesAsync(ct);

	public async Task CommitAsync(CancellationToken ct = default)
	{
		if (_tx is null || _done) return;
		await db.SaveChangesAsync(ct);
		await _tx.CommitAsync(ct);
		_done = true;
	}

	public async Task RollbackAsync(CancellationToken ct = default)
	{
		if (_tx is null || _done) return;
		await _tx.RollbackAsync(ct);
		_done = true;
	}

	public async ValueTask DisposeAsync()
	{
		if (_tx is not null)
		{
			if (!_done) await _tx.RollbackAsync();
			await _tx.DisposeAsync();
			_tx = null;
		}
		await db.DisposeAsync();
	}
}