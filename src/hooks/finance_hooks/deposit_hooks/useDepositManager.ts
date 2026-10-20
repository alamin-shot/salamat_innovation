"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDepositStore, Deposit } from "./useDepositStore";
import { useDirectorStore } from "../withdrawal_hooks/useDirectorStore";

export function useDepositManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { deposits, deleteDeposit, bulkDeleteDeposits } = useDepositStore();
    const { directors } = useDirectorStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "edit-deposit" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Deposit, query: string) =>
        item.title.toLowerCase().includes(query.toLowerCase()) || item.shopName.toLowerCase().includes(query.toLowerCase())
        , []);

    const table = useTableManager<Deposit>(deposits, filterFn);
    useEffect(() => { table.setData(deposits); }, [deposits]);

    // Map director data into deposit records for table display
    const mappedData = useMemo(() => {
        return table.filteredData.map(d => {
            const dir = directors.find(dir => dir.id === d.directorId);
            return { ...d, directorName: dir?.name || "Unknown", directorAvatar: dir?.avatar || "-" };
        });
    }, [table.filteredData, directors]);

    const activeEditRecord = useMemo(() => deposits.find((d) => d.id === retainedEditId) || null, [deposits, retainedEditId]);

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

    const handleEdit = (id: string) => openView("drawer", "edit-deposit", id);

    const handleDelete = (id: string) => {
        deleteDeposit(id);
        table.setSelectedIds((p) => p.filter((i) => i !== id));
        toast.success("Deposit deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteDeposits(table.selectedIds);
        table.clearSelection();
        toast.success("Selected deposits deleted.");
    };

    const handleViewAttachment = (id: string) => {
        toast.info("Viewing attachment...");
    };

    return {
        activeDrawer, closeView, activeEditRecord, table: { ...table, paginatedData },
        cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns,
        activeNoteRowId, toggleNotePopover, closeNotePopover, currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage, handleEdit, handleDelete, handleBulkDelete, handleViewAttachment
    };
}