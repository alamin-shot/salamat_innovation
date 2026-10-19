"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useTelesaleResultsStore, TelesaleResultItem } from "./useTelesaleResultsStore";

export function useTelesaleResultsManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { results, updateResult, deleteResult, bulkDeleteResults } = useTelesaleResultsStore();

    const [retainedViewId, setRetainedViewId] = useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "view-telesale-result" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-telesale-result" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: TelesaleResultItem, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(lower) ||
            item.color.toLowerCase().includes(lower) ||
            item.status.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<TelesaleResultItem>(results, filterFn);

    // Keep table data synchronized when Zustand store updates
    useEffect(() => {
        table.setData(results);
    }, [results]);

    const activeViewRecord = useMemo(
        () => results.find((r) => r.id === retainedViewId) || null,
        [results, retainedViewId]
    );

    const activeEditRecord = useMemo(
        () => results.find((r) => r.id === retainedEditId) || null,
        [results, retainedEditId]
    );

    // Column Visibility State
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        name: true,
        color: true,
        sortOrder: true,
        status: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        setCols({ name: true, color: true, sortOrder: true, status: true });
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    // Drawer Triggers
    const handleView = (id: string) => openView("drawer", "view-telesale-result", id);
    const handleEdit = (id: string) => openView("drawer", "edit-telesale-result", id);
    const handleCreate = () => openView("drawer", "create-telesale-result", undefined);

    // Inline Table Updaters
    const handleColorChange = (id: string, newColor: TelesaleResultItem["color"]) => {
        updateResult(id, { color: newColor });
        toast.success(`Result color updated to ${newColor}.`);
    };

    const handleStatusChange = (id: string, newStatus: TelesaleResultItem["status"]) => {
        updateResult(id, { status: newStatus });
        toast.success(`Result status updated to ${newStatus}.`);
    };

    const handleDelete = (id: string) => {
        deleteResult(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Telesale result deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteResults(table.selectedIds);
        table.clearSelection();
        toast.success("Selected telesale results deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedViewId,
        retainedEditId,
        activeViewRecord,
        activeEditRecord,
        table: {
            ...table,
            paginatedData,
        },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleView,
        handleEdit,
        handleCreate,
        handleColorChange,
        handleStatusChange,
        handleDelete,
        handleBulkDelete,
    };
}