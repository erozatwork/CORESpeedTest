using CAS.FinancePortal.Web.Server.Core.Models.Components;
using System.Linq.Dynamic.Core;

namespace CAS.FinancePortal.Web.Server.Persistence.ComponentServices
{
	public static class DataTableComponent<T>
	{
		public static DataTableResponseDto<T> Process(
			List<T> source,
			string? search,
			int start,
			int length,
			string draw,
			string sortColumn,
			string sortDirection)
		{
			var totalRecords = source.Count;

			IEnumerable<T> query = source;

			// Filtering
			if (!string.IsNullOrWhiteSpace(search))
			{
				query = ApplySearch(query, search);
			}

			var filteredRecords = query.Count();

			// Sorting
			query = ApplySorting(query, sortColumn, sortDirection);

			// Pagination
			query = ApplyPagination(query, start, length);

			var resultList = query.ToList();

			return new DataTableResponseDto<T>
			{
				Draw = draw,
				RecordsTotal = totalRecords,
				RecordsFiltered = filteredRecords,
				Data = resultList
			};
		}

		// Reflection-based search, in-memory
		private static IEnumerable<T> ApplySearch(IEnumerable<T> source, string search)
		{
			var lowerSearch = search.ToLower();
			var stringProperties = typeof(T).GetProperties()
				.Where(p => p.PropertyType == typeof(string))
				.ToList();

			// Debug: print property names
			// Remove or comment out in production
			foreach (var prop in stringProperties)
			{
				Console.WriteLine($"Searching property: {prop.Name}");
			}

			return source.Where(item =>
				stringProperties.Any(prop =>
				{
					var value = prop.GetValue(item) as string;
					return value != null && value.ToLower().Contains(lowerSearch);
				}));
		}

		private static IEnumerable<T> ApplySorting(IEnumerable<T> source, string sortColumn, string sortDirection)
		{
			if (string.IsNullOrWhiteSpace(sortColumn)) return source;

			try
			{
				return source.AsQueryable().OrderBy($"{sortColumn} {sortDirection}");
			}
			catch
			{
				return source;
			}
		}

		private static IEnumerable<T> ApplyPagination(IEnumerable<T> source, int start, int length)
		{
			return length != -1 ? source.Skip(start).Take(length) : source;
		}
	}
}
