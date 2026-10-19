"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useOrderListStore, OrderItem } from "./useOrderListStore";

export function useOrderListManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { orders, updateDeliveryStatus, deleteOrder, bulkDeleteOrders } = useOrderListStore();

    const [retainedViewId, setRetainedViewId] = useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "view-order" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-order" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: OrderItem, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.customer.toLowerCase().includes(lower) ||
            item.customerPhone.toLowerCase().includes(lower) ||
            item.product.toLowerCase().includes(lower) ||
            item.orderPerson.toLowerCase().includes(lower) ||
            item.invoiceNo.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<OrderItem>(orders, filterFn);

    useEffect(() => {
        table.setData(orders);
    }, [orders]);

    const activeViewRecord = useMemo(
        () => orders.find((o) => o.id === retainedViewId) || null,
        [orders, retainedViewId]
    );

    const activeEditRecord = useMemo(
        () => orders.find((o) => o.id === retainedEditId) || null,
        [orders, retainedEditId]
    );

    // Interactive Popover States for Address & Note cells
    const [activeAddressRowId, setActiveAddressRowId] = useState<string | null>(null);
    const [activeNoteRowId, setActiveNoteRowId] = useState<string | null>(null);

    const toggleAddressPopover = (id: string) =>
        setActiveAddressRowId((prev) => (prev === id ? null : id));
    const closeAddressPopover = () => setActiveAddressRowId(null);

    const toggleNotePopover = (id: string) =>
        setActiveNoteRowId((prev) => (prev === id ? null : id));
    const closeNotePopover = () => setActiveNoteRowId(null);

    // Column Visibility State
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        customer: true,
        date: true,
        confirmationDate: true,
        product: true,
        address: true,
        orderMedia: true,
        onlineOffline: true,
        orderPerson: true,
        advanceMedia: true,
        advanceAmount: true,
        sellingPrice: true,
        cod: true,
        note: true,
        deliveryStatus: true,
        invoiceNo: true,
        deliveryBy: true,
        track: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        const allTrue = Object.keys(cols).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {} as typeof cols
        );
        setCols(allTrue);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    // Drawer Triggers
    const handleView = (id: string) => openView("drawer", "view-order", id);
    const handleEdit = (id: string) => openView("drawer", "edit-order", id);
    const handleCreate = () => openView("drawer", "create-order", undefined);

    // Inline Delivery Status Update
    const handleDeliveryStatusChange = (id: string, newStatus: string) => {
        updateDeliveryStatus(id, newStatus);
        toast.success(`Delivery status updated to ${newStatus}.`);
    };

    const handleDelete = (id: string) => {
        deleteOrder(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Order record deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteOrders(table.selectedIds);
        table.clearSelection();
        toast.success("Selected order records deleted.");
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
        activeAddressRowId,
        toggleAddressPopover,
        closeAddressPopover,
        activeNoteRowId,
        toggleNotePopover,
        closeNotePopover,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleView,
        handleEdit,
        handleCreate,
        handleDeliveryStatusChange,
        handleDelete,
        handleBulkDelete,
    };
}