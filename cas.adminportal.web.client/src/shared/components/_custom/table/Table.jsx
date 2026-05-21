import { CaretDown, CaretUp } from "@phosphor-icons/react";
import TableLoader from "../../loaders/TableLoader";
import {
  Table as DefaultTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components";
import { TablePagination } from "./TablePagination";

export const Table = (props) => {
  const {
    order,
    onSort,
    orderBy,
    isLoading,
    data,
    columns,
    rowsPerPage,
    onRowsPerPageChange,
    onChangePage,
    count = 0,
    page,
    noGrid = false,
  } = props;

  const start = count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = start + (data?.length > 0 ? data?.length - 1 : 0);

  return (
    <>
      <div className="scrollable-x-auto">
        <DefaultTable className="text-left border-collapse whitespace-nowrap overflow-hidden">
          <TableHeader className="font-bold bg-[#f8fafc] dark:bg-[#1e293b] text-[#475569] dark:text-[#94a3b8] uppercase border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessor}
                  className={`py-3 px-4 text-[0.8rem] border-x border-gray-100/50 dark:border-gray-800 text-[#475569] dark:text-[#94a3b8] font-bold tracking-wider whitespace-nowrap ${column.className || ""
                    } ${column.sortable ? "sortable cursor-pointer hover:bg-gray-100" : ""}`}
                  onClick={
                    column.sortable ? () => onSort(column.accessor) : undefined
                  }
                >
                  <div
                    className={`${column.sortable &&
                      `flex justify-${column.className?.includes("text-center")
                        ? "center"
                        : column.className?.includes("text-right")
                          ? "end"
                          : "start"
                      }`
                      }`}
                  >
                    {column.Header}
                    {column.sortable && orderBy === column.accessor && (
                      <span className="ml-2">
                        {orderBy === column.accessor &&
                          (order === "asc" ? (
                            <CaretUp size={12} weight="bold" />
                          ) : (
                            <CaretDown size={12} weight="bold" />
                          ))}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoader rowsPerPage={rowsPerPage} colSpan={columns.length} />
            ) : (
              <>
                {data?.map((row, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/80 transition-colors group">
                    {columns.map((column, x) => (
                      <TableCell
                        key={column.accessor}
                        className={`border-b border-gray-100 dark:border-gray-800 text-[#1e293b]/90 dark:text-gray-200 text-sm py-3 px-4 whitespace-nowrap ${column.className || ""
                          }`}
                      >
                        {column.Cell ? column.Cell(row, i) : row[column.accessor]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}

            {!isLoading && data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-lg font-medium bg-gray-100 dark:bg-[#1C252E]"
                >
                  <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-[#1C252E] dark:text-gray-600 h-48">
                    No Data Available
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </DefaultTable>
      </div>



      <TablePagination
        isLoading={isLoading}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        onChangePage={onChangePage}
        count={count}
        totalPages={Math.ceil(count / rowsPerPage)}
        page={page}
        start={start}
        end={end}
      />
    </>
  );
};
