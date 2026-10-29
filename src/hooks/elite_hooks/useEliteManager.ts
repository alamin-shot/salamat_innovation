"use client";
import { useState, useCallback } from "react";
import { useEliteStore, EliteTier } from "@/store/useEliteStore";
import { toast } from "sonner";

export type EliteDrawerType = "none" | "add" | "edit";

export function useEliteManager() {
    const store = useEliteStore();

    // Drawer Routing State
    const [activeDrawer, setActiveDrawer] = useState<EliteDrawerType>("none");
    const [activeTierId, setActiveTierId] = useState<string | null>(null);

    const openAddDrawer = useCallback(() => {
        setActiveTierId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveTierId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveTierId(null), 300); // Wait for transition animation
    }, []);

    const getActiveTier = useCallback((): EliteTier | undefined => {
        if (!activeTierId) return undefined;
        return store.tiers.find(t => t.id === activeTierId);
    }, [activeTierId, store.tiers]);

    // Action Handlers (Keeps UI stateless)
    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this Elite tier?")) {
            store.deleteTier(id);
            toast.success("Elite tier deleted successfully");
        }
    }, [store]);

    const handleFormSubmit = useCallback((data: Omit<EliteTier, "id">) => {
        if (activeDrawer === "add") {
            store.addTier(data);
            toast.success("Elite tier created successfully");
        } else if (activeDrawer === "edit" && activeTierId) {
            store.updateTier(activeTierId, data);
            toast.success("Elite tier updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeTierId, store, closeDrawer]);

    return {
        tiers: store.tiers,
        activeDrawer,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        getActiveTier,
        handleDelete,
        handleFormSubmit
    };
}

export type EliteManagerType = ReturnType<typeof useEliteManager>;