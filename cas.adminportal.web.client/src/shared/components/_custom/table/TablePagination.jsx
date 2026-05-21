import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@shared/components";
import { Button } from "@shared/components";
import { Ellipsis } from "lucide-react";

import { useTable } from "./useTable";

export const TablePagination = ({
  isLoading,
  count = 0,
  page,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  onChangePage,
  onRowsPerPageChange,
  totalPages = 0,
  start,
  end,
}) => {
  const { getPagination } = useTable();

  const {
    firstPages,
    prevDropdownPages,
    nextPages,
    dropdownPages,
    finalNextThreePages,
  } = getPagination(page, totalPages);

  const renderPage = (pageIndex) => (
    <li key={pageIndex}>
      <a
        className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded cursor-pointer transition-colors ${pageIndex === page
          ? "bg-blue-500 text-white font-bold"
          : "text-gray-600 hover:text-blue-500"
          }`}
        onClick={() => onChangePage(pageIndex)}
      >
        {pageIndex}
      </a>
    </li>
  );

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-y-3 gap-x-4 px-4 py-3 border-t border-gray-100 dark:border-gray-800 dark:text-white">

        {/* Left: rows-per-page + showing text */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Select
            value={rowsPerPage != null ? String(rowsPerPage) : undefined}
            onValueChange={(v) =>
              onRowsPerPageChange &&
              onRowsPerPageChange({ target: { value: String(v) } })
            }
          >
            <SelectTrigger className="w-[65px] h-8 text-sm font-semibold border-gray-200 text-gray-700">
              <SelectValue placeholder={String(rowsPerPageOptions[0] ?? 5)} />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((v, i) => (
                <SelectItem key={i} value={String(v)}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-500 whitespace-nowrap">
            Showing {start || 0} to {end || 0} of {count || 0} records
          </span>
        </div>

        {/* Right: navigation */}
        <div className="flex items-center gap-1">

          {/* Previous chevron */}
          <button
            disabled={isLoading || page === 1 || totalPages === 0}
            onClick={() => onChangePage(page !== 1 ? page - 1 : page)}
            className="flex items-center justify-center w-8 h-8 rounded text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          <ul className="flex items-center gap-0.5">
            {firstPages.map((p) => renderPage(p))}

            {prevDropdownPages.length > 0 && (
              <li className="hidden sm:flex items-center justify-center w-8 h-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors">
                      <span className="text-sm tracking-widest">···</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="min-w-9 p-0 max-h-fit"
                    position="popper"
                  >
                    <DropdownMenuGroup>
                      {prevDropdownPages.map((p) => (
                        <a
                          key={p}
                          className="block text-center px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-100 hover:text-blue-500 transition-colors rounded"
                          onClick={() => onChangePage(p)}
                        >
                          {p}
                        </a>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )}

            {nextPages.map((p) => renderPage(p))}

            {dropdownPages.length > 0 && (
              <li className="hidden sm:flex items-center justify-center w-8 h-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors">
                      <span className="text-sm tracking-widest">···</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="min-w-9 p-0"
                    position="popper"
                  >
                    <DropdownMenuGroup>
                      {dropdownPages.map((p) => (
                        <a
                          key={p}
                          className="block text-center px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-100 hover:text-blue-500 transition-colors rounded"
                          onClick={() => onChangePage(p)}
                        >
                          {p}
                        </a>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )}

            {finalNextThreePages.map((p) => renderPage(p))}
          </ul>

          {/* Next chevron */}
          <button
            disabled={isLoading || totalPages === page || totalPages === 0}
            onClick={() => onChangePage(page !== totalPages ? page + 1 : page)}
            className="flex items-center justify-center w-8 h-8 rounded text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <CaretRight size={16} weight="bold" />
          </button>

        </div>
      </div>
    </>
  );
};
