"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/useTableManager";
import { useCommandParams } from "@/hooks/useCommandParams";
import { useOrderOptionsStore, OrderOptionItem } from "./useOrderOptionsStore";

export function useOrderOptionsManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { options, updateOptionStatus, deleteOption, bulkDeleteOptions } = useOrderOptionsStore();

    const [retainedViewId, setRetainedViewId] = useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "view-order-option" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-order-option" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: OrderOptionItem, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(lower) ||
            item.type.toLowerCase().includes(lower) ||
            item.status.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<OrderOptionItem>(options, filterFn);

    useEffect(() => {
        table.setData(options);
    }, [options]);

    const activeViewRecord = useMemo(
        () => options.find((o) => o.id === retainedViewId) || null,
        [options, retainedViewId]
    );

    const activeEditRecord = useMemo(
        () => options.find((o) => o.id === retainedEditId) || null,
        [options, retainedEditId]
    );

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        type: true,
        name: true,
        sortOrder: true,
        status: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        setCols({ type: true, name: true, sortOrder: true, status: true });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleView = (id: string) => openView("drawer", "view-order-option", id);
    const handleEdit = (id: string) => openView("drawer", "edit-order-option", id);
    const handleCreate = () => openView("drawer", "create-order-option", undefined);

    const handleStatusChange = (id: string, newStatus: OrderOptionItem["status"]) => {
        updateOptionStatus(id, newStatus);
        toast.success(`Status updated to ${newStatus}.`);
    };

    const handleDelete = (id: string) => {
        deleteOption(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Order option deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteOptions(table.selectedIds);
        table.clearSelection();
        toast.success("Selected options deleted.");
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
        handleStatusChange,
        handleDelete,
        handleBulkDelete,
    };
}