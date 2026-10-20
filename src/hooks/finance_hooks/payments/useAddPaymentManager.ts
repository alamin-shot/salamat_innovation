"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAddPaymentStore, PaymentEntity } from "./useAddPaymentStore";
import { useCommandParams } from "../../shared_hooks/useCommandParams";
import { useTableManager } from "../../shared_hooks/useTableManager";

export function useAddPaymentManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { entities, deleteEntity, bulkDeleteEntities } = useAddPaymentStore();

    const [retainedActionId, setRetainedActionId] = useState<string | null>(null);

    useEffect(() => {
        if ((activeDrawer === "receive-payment" || activeDrawer === "send-payment") && activeId) {
            setRetainedActionId(activeId);
        }
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: PaymentEntity, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(lower) ||
            item.businessName.toLowerCase().includes(lower) ||
            item.phoneNumber.includes(lower)
        );
    }, []);

    const table = useTableManager<PaymentEntity>(entities, filterFn);

    useEffect(() => {
        table.setData(entities);
    }, [entities]);

    const activeRecord = useMemo(
        () => entities.find((e) => e.id === retainedActionId) || null,
        [entities, retainedActionId]
    );

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        name: true,
        businessName: true,
        businessLogo: true,
        phoneNumber: true,
        debit: true,
        credit: true,
        balance: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        setCols({ name: true, businessName: true, businessLogo: true, phoneNumber: true, debit: true, credit: true, balance: true });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleReceive = (id: string) => openView("drawer", "receive-payment", id);
    const handleSend = (id: string) => openView("drawer", "send-payment", id);

    const handleDelete = (id: string) => {
        deleteEntity(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteEntities(table.selectedIds);
        table.clearSelection();
        toast.success("Selected records deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedActionId,
        activeRecord,
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
        handleReceive,
        handleSend,
        handleDelete,
        handleBulkDelete,
    };
}