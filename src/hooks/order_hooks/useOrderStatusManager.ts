"use client";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useOrderStore, OrderStatus, OrderRecord } from "@/store/useOrderStore";
import { useTableManager } from "../shared_hooks/useTableManager";


// Config interfaces that drive the entire UI
export interface OrderActionConfig {
    label: string;
    icon: React.ElementType;
    colorClass: string;
    onClick: (orderId: string, manager: OrderStatusManagerType) => void;
}

export interface OrderPageConfig {
    title: string;
    targetStatus: OrderStatus;
    emptyStateMessage: string;
    actions: OrderActionConfig[];
}

export function useOrderStatusManager(config: OrderPageConfig) {
    const store = useOrderStore();

    // 1. Firmly filter orders BEFORE passing to useTableManager to prevent infinite render loops
    const filteredOrders = useMemo(() => {
        return store.orders.filter(order => order.status === config.targetStatus);
    }, [store.orders, config.targetStatus]);

    const table = useTableManager(
        filteredOrders,
        (order, query) => {
            const lowerQuery = query.toLowerCase();
            return (
                order.orderNumber.toLowerCase().includes(lowerQuery) ||
                order.customerName.toLowerCase().includes(lowerQuery) ||
                order.customerPhone.includes(lowerQuery)
            );
        }
    );

    // 2. Drawer State (All these pages use the Invoice Preview)
    const [activeDrawer, setActiveDrawer] = useState<"none" | "invoice">("none");
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    const openInvoice = useCallback((orderId: string) => {
        setActiveOrderId(orderId);
        setActiveDrawer("invoice");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveOrderId(null), 500);
    }, []);

    const getActiveOrder = useCallback((): OrderRecord | undefined => {
        return store.orders.find(o => o.id === activeOrderId);
    }, [activeOrderId, store.orders]);

    // 3. Status Transition Helper for the Config Buttons
    const changeStatus = useCallback((id: string, newStatus: OrderStatus) => {
        store.updateOrderStatus(id, newStatus);
        toast.success(`Order moved to ${newStatus}`);
    }, [store]);

    return {
        config,
        table,
        activeDrawer,
        activeOrderId,
        openInvoice,
        closeDrawer,
        getActiveOrder,
        changeStatus,
    };
}

export type OrderStatusManagerType = ReturnType<typeof useOrderStatusManager>;