import { useMemo, useState } from "react";

/**
 * Search + pagination kept in component state (no URL sync), for pages that show more than one
 * table, where URL-synced `?page=` / `?search=` would make the tables overwrite each other.
 */
export function useLocalListControls<T>(data: T[], filterFn: (item: T, query: string) => boolean, itemsPerPage = 10) {
    const [searchQuery, setSearchQueryState] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        const query = searchQuery.trim();
        return query ? data.filter((item) => filterFn(item, query)) : data;
    }, [data, searchQuery, filterFn]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    const page = Math.min(currentPage, totalPages);
    const paginatedData = useMemo(() => filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage), [filteredData, page, itemsPerPage]);

    return {
        searchQuery,
        setSearchQuery: (value: string) => { setSearchQueryState(value); setCurrentPage(1); },
        filteredData,
        paginatedData,
        currentPage: page,
        setCurrentPage,
        totalPages,
        itemsPerPage,
    };
}

export type LocalListControls<T> = ReturnType<typeof useLocalListControls<T>>;
