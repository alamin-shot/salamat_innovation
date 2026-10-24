"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export function useTableManager<T>(
    initialData: T[],
    filterFn: (item: T, query: string) => boolean,
    defaultItemsPerPage = 10
) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState<T[]>(initialData);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // URL-synced state
    const pageParam = searchParams.get("page");
    const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam, 10) : 1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    const isFirstSearchEffect = useRef(true);

    // 300ms Debounce for performance
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 on new search (skip initial render to preserve incoming URL page param)
    useEffect(() => {
        if (isFirstSearchEffect.current) {
            isFirstSearchEffect.current = false;
            return;
        }
        setCurrentPage(1);
    }, [debouncedQuery]);

    // Sync state when browser navigation occurs (e.g. Back / Forward button)
    useEffect(() => {
        const onPopState = () => {
            const currentParams = new URLSearchParams(window.location.search);
            const page = currentParams.get("page");
            const search = currentParams.get("search") || "";

            const targetPage = page ? parseInt(page, 10) : 1;
            if (!isNaN(targetPage)) {
                setCurrentPage(targetPage);
            }
            setSearchQuery(search);
            setDebouncedQuery(search);
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    // Update URL using shallow history replaceState without triggering Next.js router cycle
    useEffect(() => {
        if (typeof window === "undefined") return;

        const currentParams = new URLSearchParams(window.location.search);
        const targetParams = new URLSearchParams(window.location.search);

        targetParams.set("page", currentPage.toString());
        if (debouncedQuery.trim()) {
            targetParams.set("search", debouncedQuery.trim());
        } else {
            targetParams.delete("search");
        }

        const currentQuery = currentParams.toString();
        const targetQuery = targetParams.toString();

        if (currentQuery !== targetQuery) {
            const newUrl = targetQuery ? `${pathname}?${targetQuery}` : pathname;
            window.history.replaceState(null, "", newUrl);
        }
    }, [currentPage, debouncedQuery, pathname]);

    const filteredData = useMemo(() => {
        if (!debouncedQuery) return data;
        return data.filter((item) => filterFn(item, debouncedQuery));
    }, [data, debouncedQuery, filterFn]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

    const handleSelectAll = useCallback((checked: boolean) => {
        setSelectedIds(checked ? filteredData.map((item: any) => item.id) : []);
    }, [filteredData]);

    const handleSelectRow = useCallback((id: string, checked: boolean) => {
        setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id));
    }, []);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    return {
        data, setData,
        searchQuery, setSearchQuery,
        selectedIds, setSelectedIds, handleSelectAll, handleSelectRow, clearSelection,
        isAllSelected: filteredData.length > 0 && selectedIds.length === filteredData.length,
        filteredData, paginatedData,
        currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage
    };
}