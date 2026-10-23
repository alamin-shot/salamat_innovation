"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useB2bStore, B2bPartner } from "./useB2bStore";

export function useB2bManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { partners, deletePartner, bulkDeletePartners, updateStatus } = useB2bStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "b2b-form" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: B2bPartner, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.businessName.toLowerCase().includes(query.toLowerCase()) ||
        item.primaryPhone.includes(query)
        , []);

    const table = useTableManager<B2bPartner>(partners, filterFn);
    useEffect(() => { table.setData(partners); }, [partners]);

    const activeEditRecord = useMemo(() => partners.find((p) => p.id === retainedEditId) || null, [partners, retainedEditId]);

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

    const handleAdd = () => openView("drawer", "b2b-form");
    const handleView = (id: string) => toast.info(`Viewing details for B2B Partner ${id}`);
    const handleEdit = (id: string) => openView("drawer", "b2b-form", id);

    const handleDelete = (id: string) => {
        deletePartner(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("B2B Partner deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeletePartners(table.selectedIds);
        table.clearSelection();
        toast.success("Selected B2B partners deleted.");
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