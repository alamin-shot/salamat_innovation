import { useState, useMemo } from "react";
import { SortDirection } from "@/types/table";

export function useDataTable<T>(initialData: T[], searchKeys: (keyof T)[]) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. Filter
    const filteredData = useMemo(() => {
        if (!searchQuery) return initialData;
        const lowerQuery = searchQuery.toLowerCase();
        return initialData.filter((item) =>
            searchKeys.some((key) => String(item[key]).toLowerCase().includes(lowerQuery))
        );
    }, [initialData, searchQuery, searchKeys]);

    // 2. Sort
    const sortedData = useMemo(() => {
        if (!sortKey || !sortDirection) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortDirection]);

    // 3. Paginate
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(start, start + itemsPerPage);
    }, [sortedData, currentPage]);

    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === "asc" ? "desc" : prev === "desc" ? null : "asc");
            if (sortDirection === "desc") setSortKey(null);
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    return {
        data: paginatedData,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
        searchQuery,
        setSearchQuery,
        sortKey,
        sortDirection,
        handleSort,
        currentPage,
        setCurrentPage,
    };
}