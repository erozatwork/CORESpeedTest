import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

const useTable = (props) => {
    const [order, setOrder] = useState(props?.defaultOrder || "asc");
    const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

    const [page, setPage] = useState(props?.defaultCurrentPage || 1);

    const useApplyFilter = (tableData, payload) => {
        const { search, sortColumnKey, sortDirection, start, length } = payload;

        if (!Array.isArray(tableData)) return [];

        const filteredData = search
            ? tableData.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            )
            : tableData;

        const sortedData = [...filteredData].sort((a, b) => {
            const aValue = a[sortColumnKey];
            const bValue = b[sortColumnKey];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return sortDirection === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });

        return sortedData.slice(start, start + length);
    };

    const [rowsPerPage, setRowsPerPage] = useState(
        props?.defaultRowsPerPage || 5
    );

    const onSort = useCallback(
        (id) => {
            const isAsc = orderBy === id && order === 'asc';
            if (id !== '') {
                setOrder(isAsc ? 'desc' : 'asc');
                setOrderBy(id);
            }
        },
        [order, orderBy]
    );

    const onChangePage = (newPage) => {
        setPage(newPage);
    };

    const onChangeRowsPerPage = useCallback((event) => {
        setPage(1);
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);


    const getPagination = (page, totalPages) => {
        const firstPages = [1];
        const nextPages = [];

        // Add up to 3 pages starting from current
        for (let i = page; i < page + 3 && i <= totalPages; i++) {
            if (!firstPages.includes(i)) nextPages.push(i);
        }

        // Include ALL previous pages between 2 and current - 1
        const prevDropdownPages = [];
        if (page > 6) {
            for (let i = 2; i < page; i++) {
                if (!firstPages.includes(i)) {
                    prevDropdownPages.push(i);
                }
            }
        }

        // Next dropdown
        const dropdownStart = nextPages.at(-1) + 1;
        const dropdownPages = [];
        for (
            let i = dropdownStart;
            i <= totalPages && dropdownPages.length < 5;
            i++
        ) {
            if (!firstPages.includes(i) && !nextPages.includes(i)) {
                dropdownPages.push(i);
            }
        }

        // Final pages after next dropdown
        const lastDropdownPage =
            dropdownPages.at(-1) ?? nextPages.at(-1) ?? firstPages.at(-1);
        const finalNextThreePages = [];
        for (
            let i = lastDropdownPage + 1;
            i <= totalPages && finalNextThreePages.length < 3;
            i++
        ) {
            if (
                !firstPages.includes(i) &&
                !nextPages.includes(i) &&
                !dropdownPages.includes(i)
            ) {
                finalNextThreePages.push(i);
            }
        }

        return {
            firstPages,
            prevDropdownPages,
            nextPages,
            dropdownPages,
            finalNextThreePages,
        };
    };

    return {
        order,
        orderBy,
        page,
        rowsPerPage,
        getPagination,
        //
        onSort,
        onChangePage,
        onChangeRowsPerPage,
        //
        setPage,
        setOrder,
        setOrderBy,
        setRowsPerPage,
        useApplyFilter
    };
}

export { useTable }