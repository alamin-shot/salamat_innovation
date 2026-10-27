"use client";
import { useState, useMemo, useCallback } from "react";
import { useCourierStore } from "@/store/useCourierStore";
import { CourierPageConfig } from "@/config/courier.config";
import { useTableManager } from "../shared_hooks/useTableManager";

export type CourierDrawerType = "none" | "sync-pathao" | "import-excel";

export function useCourierManager(config: CourierPageConfig) {
    const store = useCourierStore();

    // 1. Filter shipments based on the config's target provider
    const filteredShipments = useMemo(() => {
        if (config.targetProvider === "All") return store.shipments;
        return store.shipments.filter(s => s.provider === config.targetProvider);
    }, [store.shipments, config.targetProvider]);

    // 2. Initialize table with search targeting tracking ID, recipient, or phone
    const table = useTableManager(
        filteredShipments,
        (shipment, query) => {
            const lower = query.toLowerCase();
            return (
                shipment.trackingId.toLowerCase().includes(lower) ||
                shipment.recipientName.toLowerCase().includes(lower) ||
                shipment.recipientPhone.includes(lower)
            );
        }
    );

    // 3. Multi-Drawer Router
    const [activeDrawer, setActiveDrawer] = useState<CourierDrawerType>("none");

    const openDrawer = useCallback((type: CourierDrawerType) => {
        setActiveDrawer(type);
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
    }, []);

    return {
        config,
        table,
        store,
        activeDrawer,
        openDrawer,
        closeDrawer
    };
}

export type CourierManagerType = ReturnType<typeof useCourierManager>;