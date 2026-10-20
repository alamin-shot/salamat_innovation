"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDirectorStore, Director } from "./useDirectorStore";

export function useDirectorManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { directors, deleteDirector, bulkDeleteDirectors } = useDirectorStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "edit-director" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Director, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) || item.shop.toLowerCase().includes(query.toLowerCase())
        , []);

    const table = useTableManager<Director>(directors, filterFn);

    useEffect(() => { table.setData(directors); }, [directors]);

    const activeEditRecord = useMemo(() => directors.find((d) => d.id === retainedEditId) || null, [directors, retainedEditId]);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({ shop: true, name: true, totalWithdrawalCount: true });
    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ shop: true, name: true, totalWithdrawalCount: true });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleEdit = (id: string) => openView("drawer", "edit-director", id);
    const handleDelete = (id: string) => { deleteDirector(id); table.setSelectedIds((p) => p.filter((i) => i !== id)); toast.success("Director deleted."); };
    const handleBulkDelete = () => { if (table.selectedIds.length === 0) return; bulkDeleteDirectors(table.selectedIds); table.clearSelection(); toast.success("Selected directors deleted."); };

    return { activeDrawer, closeView, retainedEditId, activeEditRecord, table: { ...table, paginatedData }, cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, handleEdit, handleDelete, handleBulkDelete };
}