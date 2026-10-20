"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useWithdrawalStore, Withdrawal } from "./useWithdrawalStore";
import { useDirectorStore } from "./useDirectorStore";

export function useWithdrawalManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { withdrawals, deleteWithdrawal, bulkDeleteWithdrawals } = useWithdrawalStore();
    const { directors } = useDirectorStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "edit-withdrawal" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Withdrawal, query: string) =>
        item.title.toLowerCase().includes(query.toLowerCase()) || item.shopName.toLowerCase().includes(query.toLowerCase())
        , []);

    const table = useTableManager<Withdrawal>(withdrawals, filterFn);
    useEffect(() => { table.setData(withdrawals); }, [withdrawals]);

    // Map director data to withdrawals for the table display
    const mappedData = useMemo(() => {
        return table.filteredData.map(w => {
            const dir = directors.find(d => d.id === w.directorId);
            return { ...w, directorName: dir?.name || "Unknown", directorAvatar: dir?.avatar || "-" };
        });
    }, [table.filteredData, directors]);

    const activeEditRecord = useMemo(() => withdrawals.find((w) => w.id === retainedEditId) || null, [withdrawals, retainedEditId]);

    // Note Popover State
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);
    const toggleNotePopover = (id: string) => setActiveNoteRowId((prev) => (prev === id ? null : id));
    const closeNotePopover = () => setActiveNoteRowId(null);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({ director: true, shopName: true, title: true, date: true, contact: true, attachments: true, note: true, amount: true, createdBy: true });
    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ director: true, shopName: true, title: true, date: true, contact: true, attachments: true, note: true, amount: true, createdBy: true });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return mappedData.slice(start, start + itemsPerPage);
    }, [mappedData, currentPage, itemsPerPage]);

    const handleEdit = (id: string) => openView("drawer", "edit-withdrawal", id);

    const handleDelete = (id: string) => {
        deleteWithdrawal(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("Withdrawal deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteWithdrawals(table.selectedIds);
        table.clearSelection();
        toast.success("Selected withdrawals deleted.");
    };

    const handleViewAttachment = (id: string) => {
        toast.info("Viewing attachment..."); s
    };

    return { activeDrawer, closeView, activeEditRecord, table: { ...table, paginatedData }, cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns, activeNoteRowId, toggleNotePopover, closeNotePopover, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, handleEdit, handleDelete, handleBulkDelete, handleViewAttachment };
}