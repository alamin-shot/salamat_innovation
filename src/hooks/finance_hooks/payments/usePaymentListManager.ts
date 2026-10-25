"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { usePaymentListStore, PaymentLog } from "./usePaymentListStore";

export function usePaymentListManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { logs, deleteLog, bulkDeleteLogs } = usePaymentListStore();

    const [retainedVoucherId, setRetainedVoucherId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "view-voucher" && activeId) {
            setRetainedVoucherId(activeId);
        }
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: PaymentLog, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.contact.toLowerCase().includes(lower) ||
            item.invoiceNumber.toLowerCase().includes(lower) ||
            item.businessName.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<PaymentLog>(logs, filterFn);

    useEffect(() => {
        table.setData(logs);
    }, [logs]);

    const activeVoucherRecord = useMemo(
        () => logs.find((l) => l.id === retainedVoucherId) || null,
        [logs, retainedVoucherId]
    );

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        contact: true,
        businessName: true,
        businessLogo: true,
        date: true,
        invoiceNumber: true,
        type: true,
        debit: true,
        credit: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        const allTrue = Object.keys(cols).reduce((acc, k) => ({ ...acc, [k]: true }), {} as typeof cols);
        setCols(allTrue);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    // Drawer Trigger strictly for Voucher
    const handleViewVoucher = (id: string) => openView("drawer", "view-voucher", id);

    const handleDelete = (id: string) => {
        deleteLog(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Payment record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteLogs(table.selectedIds);
        table.clearSelection();
        toast.success("Selected payment records deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedVoucherId,
        activeVoucherRecord,
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
        handleViewVoucher,
        handleDelete,
        handleBulkDelete,
    };
}

export type PaymentListManagerType = ReturnType<typeof usePaymentListManager>;