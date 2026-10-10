"use client";
import { useState, useMemo } from "react";

export function useTableManager<T extends { id: string }>(
    initialData: T[],
    filterFn: (item: T, query: string) => boolean
) {
    const [data, setData] = useState<T[]>(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Automatically derives the filtered list based on the search query
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        return data.filter(item => filterFn(item, searchQuery));
    }, [data, searchQuery, filterFn]);

    // Handle "Select All" checkbox
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredData.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    // Handle individual row checkbox
    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const clearSelection = () => setSelectedIds([]);

    // Derived boolean to check if the main header checkbox should be active
    const isAllSelected = selectedIds.length === filteredData.length && filteredData.length > 0;

    return {
        data,
        setData,
        searchQuery,
        setSearchQuery,
        filteredData,
        selectedIds,
        setSelectedIds,
        handleSelectAll,
        handleSelectRow,
        clearSelection,
        isAllSelected
    };
}