import { TableCell, TableRow } from "../ui/table";

export default function TableLoader({ colSpan, rowsPerPage }) {
    return [...Array(rowsPerPage)].map((x, y) => (
        <TableRow key={y}>
            {[...Array(colSpan)].map((i, k) => (
                <TableCell key={k}>
                    <div
                        className={`animate-pulse bg-gray-200 rounded-md py-4 px-6`}
                    ></div>
                </TableCell>
            ))}
        </TableRow>
    ));
}
