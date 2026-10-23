"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useFranchiseStore, Franchise } from "./useFranchiseStore";

export function useFranchiseManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { franchises, deleteFranchise, bulkDeleteFranchises, updateStatus } = useFranchiseStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "franchise-form" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Franchise, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.businessName.toLowerCase().includes(query.toLowerCase()) ||
        item.primaryPhone.includes(query)
        , []);

    const table = useTableManager<Franchise>(franchises, filterFn);
    useEffect(() => { table.setData(franchises); }, [franchises]);

    const activeEditRecord = useMemo(() => franchises.find((f) => f.id === retainedEditId) || null, [franchises, retainedEditId]);

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

    const handleAdd = () => openView("drawer", "franchise-form");
    const handleView = (id: string) => toast.info(`Viewing details for Franchise ${id}`);
    const handleEdit = (id: string) => openView("drawer", "franchise-form", id);

    const handleDelete = (id: string) => {
        deleteFranchise(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("Franchise deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteFranchises(table.selectedIds);
        table.clearSelection();
        toast.success("Selected franchises deleted.");
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateStatus(id, newStatus);
        toast.success(`Status updated to ${newStatus}`);
    };

    return {
        activeDrawer, closeView, activeEditRecord, table: { ...table, paginatedData },
        cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        handleAdd, handleView, handleEdit, handleDelete, handleBulkDelete, handleStatusChange
    };
}