"use client";
import { useState, useCallback } from "react";
import { useReelsStore, ReelRecord } from "@/store/useReelsStore";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { toast } from "sonner";

export type ReelsDrawerType = "none" | "add" | "edit";

export function useReelsManager() {
    const store = useReelsStore();

    // 1. Initialize standard table orchestrator
    const table = useTableManager(
        store.reels,
        (reel, query) => reel.productName.toLowerCase().includes(query.toLowerCase())
    );

    // 2. Drawer Routing State
    const [activeDrawer, setActiveDrawer] = useState<ReelsDrawerType>("none");
    const [activeReelId, setActiveReelId] = useState<string | null>(null);

    const openAddDrawer = useCallback(() => {
        setActiveReelId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveReelId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveReelId(null), 300); // Wait for transition
    }, []);

    const getActiveReel = useCallback((): ReelRecord | undefined => {
        if (!activeReelId) return undefined;
        return store.reels.find(r => r.id === activeReelId);
    }, [activeReelId, store.reels]);

    // 3. Action Handlers (Keeps UI stateless)
    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this reel?")) {
            store.deleteReel(id);
            toast.success("Reel deleted successfully");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (table.selectedIds.length === 0) return;
        if (confirm(`Delete ${table.selectedIds.length} selected reels?`)) {
            store.deleteMultipleReels(table.selectedIds);
            table.setSelectedIds([]); // Clear selection after action
            toast.success("Selected reels deleted");
        }
    }, [store, table]);

    const handleFormSubmit = useCallback((data: Omit<ReelRecord, "id">) => {
        if (activeDrawer === "add") {
            store.addReel(data);
            toast.success("Reel added successfully");
        } else if (activeDrawer === "edit" && activeReelId) {
            store.updateReel(activeReelId, data);
            toast.success("Reel updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeReelId, store, closeDrawer]);

    return {
        table,
        activeDrawer,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        getActiveReel,
        handleDelete,
        handleBulkDelete,
        handleFormSubmit
    };
}

export type ReelsManagerType = ReturnType<typeof useReelsManager>;