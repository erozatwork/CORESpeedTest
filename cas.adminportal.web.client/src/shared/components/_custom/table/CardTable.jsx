import { TablePagination } from "./TablePagination";

export const CardTable = (props) => {
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
    count,
    page,
    children,
  } = props;

  const start = count === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = start + (data?.length > 0 ? data?.length - 1 : 0);

  return (
    <>
      <div className="max-h-fit scrollable-y-hover pr-0.5 pb-1">
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">{children}</div>
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
        rowsPerPageOptions={[12, 24, 36, 48, 60]}
      />
    </>
  );
};
