"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetailerStore, Retailer } from "./useRetailerStore";

export function useRetailerManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { retailers, deleteRetailer, bulkDeleteRetailers, updateStatus } = useRetailerStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "retailer-form" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Retailer, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.businessName.toLowerCase().includes(query.toLowerCase()) ||
        item.primaryPhone.includes(query)
        , []);

    const table = useTableManager<Retailer>(retailers, filterFn);
    useEffect(() => { table.setData(retailers); }, [retailers]);

    const activeEditRecord = useMemo(() => retailers.find((r) => r.id === retainedEditId) || null, [retailers, retainedEditId]);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({ customer: true, businessName: true, primaryPhone: true, email: true, address: true, status: true });
    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ customer: true, businessName: true, primaryPhone: true, email: true, address: true, status: true });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleAdd = () => openView("drawer", "retailer-form");
    const handleEdit = (id: string) => openView("drawer", "retailer-form", id);

    const handleDelete = (id: string) => {
        deleteRetailer(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("Retailer deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteRetailers(table.selectedIds);
        table.clearSelection();
        toast.success("Selected retailers deleted.");
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateStatus(id, newStatus);
        toast.success(`Status updated to ${newStatus}`);
    };

    return {
        activeDrawer, closeView, activeEditRecord, table: { ...table, paginatedData },
        cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        handleAdd, handleEdit, handleDelete, handleBulkDelete, handleStatusChange
    };
}