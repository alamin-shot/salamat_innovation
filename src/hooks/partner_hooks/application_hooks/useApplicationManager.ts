"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useApplicationStore, Application } from "./useApplicationStore";

export function useApplicationManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { applications, deleteApplication, bulkDeleteApplications, updateStatus } = useApplicationStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "application-form" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Application, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.phone.includes(query) ||
        item.email.toLowerCase().includes(query.toLowerCase())
        , []);

    const table = useTableManager<Application>(applications, filterFn);
    useEffect(() => { table.setData(applications); }, [applications]);

    const activeEditRecord = useMemo(() => applications.find((a) => a.id === retainedEditId) || null, [applications, retainedEditId]);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({ name: true, phone: true, email: true, address: true, status: true });
    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ name: true, phone: true, email: true, address: true, status: true });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleAdd = () => openView("drawer", "application-form");
    const handleView = (id: string) => toast.info(`Viewing details for Application ${id}`);
    const handleEdit = (id: string) => openView("drawer", "application-form", id);

    const handleDelete = (id: string) => {
        deleteApplication(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("Application deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteApplications(table.selectedIds);
        table.clearSelection();
        toast.success("Selected applications deleted.");
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