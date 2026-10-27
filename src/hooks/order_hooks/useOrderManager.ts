"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useOrderStore, OrderStatus, PaymentStatus, OrderRecord } from "@/store/useOrderStore";
import { useTableManager } from "../shared_hooks/useTableManager";


export type DrawerType = "none" | "invoice" | "payment" | "update-item" | "fraud";

export function useOrderManager() {
    const store = useOrderStore();
    const table = useTableManager(
        store.orders,
        (order, query) => {
            const lowerQuery = query.toLowerCase();
            return (
                order.orderNumber.toLowerCase().includes(lowerQuery) ||
                order.customerName.toLowerCase().includes(lowerQuery) ||
                order.customerPhone.includes(lowerQuery)
            );
        }
    );

    // Multi-Drawer State Router
    const [activeDrawer, setActiveDrawer] = useState<DrawerType>("none");
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    // Safety confirm modal for deletes
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => { } });
    const closeConfirm = () => setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: () => { } });

    // --- Drawer Orchestration ---
    const openDrawer = useCallback((type: DrawerType, orderId: string) => {
        setActiveOrderId(orderId);
        setActiveDrawer(type);
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        // We do NOT clear activeOrderId immediately so the drawer can animate out without data flashing null
        setTimeout(() => setActiveOrderId(null), 500);
    }, []);

    const getActiveOrder = useCallback((): OrderRecord | undefined => {
        return store.orders.find(o => o.id === activeOrderId);
    }, [activeOrderId, store.orders]);

    // --- Inline Table Actions ---
    const handleInlineStatusChange = useCallback((id: string, status: OrderStatus) => {
        store.updateOrderStatus(id, status);
        toast.success(`Order ${id} status updated to ${status}`);
    }, [store]);

    const handleInlinePaymentStatusChange = useCallback((id: string, pStatus: PaymentStatus) => {
        store.updatePaymentStatus(id, pStatus);
        toast.success(`Order ${id} payment updated to ${pStatus}`);
    }, [store]);

    // --- Bulk Actions ---
    const handleBulkDelete = useCallback(() => {
        if (table.selectedIds.length === 0) return;
        setConfirmModal({
            isOpen: true,
            title: "Delete Orders",
            message: `Are you sure you want to delete ${table.selectedIds.length} orders?`,
            onConfirm: () => {
                store.bulkDeleteOrders(table.selectedIds);
                table.clearSelection();
                toast.success(`${table.selectedIds.length} orders deleted`);
                closeConfirm();
            }
        });
    }, [table, store]);

    return {
        table,
        activeDrawer,
        activeOrderId,
        openDrawer,
        closeDrawer,
        getActiveOrder,
        handleInlineStatusChange,
        handleInlinePaymentStatusChange,
        handleBulkDelete,
        confirmModal,
        closeConfirm,
        store // Exposed for specific drawer form submissions
    };
}

export type OrderManagerType = ReturnType<typeof useOrderManager>;