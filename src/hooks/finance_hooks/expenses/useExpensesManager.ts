"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useExpensesStore, ExpenseItem } from "./useExpensesStore";

export function useExpensesManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { expenses, deleteExpense, bulkDeleteExpenses } = useExpensesStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);
    const [retainedVoucherId, setRetainedVoucherId] = useState<string | null>(null);
    const [activeReportData, setActiveReportData] = useState<ExpenseItem[]>([]);

    useEffect(() => {
        if (activeDrawer === "edit-expense" && activeId) setRetainedEditId(activeId);
        if (activeDrawer === "view-expense-voucher" && activeId) setRetainedVoucherId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: ExpenseItem, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.title.toLowerCase().includes(lower) ||
            item.invoiceNumber.toLowerCase().includes(lower) ||
            item.category.toLowerCase().includes(lower) ||
            item.shopName.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<ExpenseItem>(expenses, filterFn);

    useEffect(() => {
        table.setData(expenses);
    }, [expenses]);

    const activeEditRecord = useMemo(() => expenses.find((e) => e.id === retainedEditId) || null, [expenses, retainedEditId]);
    const activeVoucherRecord = useMemo(() => expenses.find((e) => e.id === retainedVoucherId) || null, [expenses, retainedVoucherId]);

    // Note Popover State
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);
    const toggleNotePopover = (id: string) => setActiveNoteRowId((prev) => (prev === id ? null : id));
    const closeNotePopover = () => setActiveNoteRowId(null);

    // Columns
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        shopName: true,
        title: true,
        invoiceNumber: true,
        date: true,
        category: true,
        attachments: true,
        note: true,
        paymentMethod: true,
        amount: true,
        createdBy: true,
    });

    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols(Object.keys(cols).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof cols));

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    // Drawer Triggers
    const handleEdit = (id: string) => openView("drawer", "edit-expense", id);
    const handlePrintVoucher = (id: string) => openView("drawer", "view-expense-voucher", id);

    // Report Triggers
    const handleGlobalReport = () => {
        setActiveReportData(table.filteredData);
        openView("drawer", "view-expense-report", undefined);
    };

    const handleBulkReport = () => {
        if (table.selectedIds.length === 0) return;
        const selectedData = expenses.filter((e) => table.selectedIds.includes(e.id));
        setActiveReportData(selectedData);
        openView("drawer", "view-expense-report", undefined);
        table.clearSelection();
    };

    const handleDelete = (id: string) => {
        deleteExpense(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Expense deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteExpenses(table.selectedIds);
        table.clearSelection();
        toast.success("Selected expenses deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedEditId,
        retainedVoucherId,
        activeEditRecord,
        activeVoucherRecord,
        activeReportData,
        table: { ...table, paginatedData },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        activeNoteRowId,
        toggleNotePopover,
        closeNotePopover,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleEdit,
        handlePrintVoucher,
        handleGlobalReport,
        handleBulkReport,
        handleDelete,
        handleBulkDelete,
    };
}