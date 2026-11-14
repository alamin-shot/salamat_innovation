import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useReelsStore } from "@/store/useReelsStore";
import { ReelInput, ReelRecord } from "@/types/reels";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";

export type ReelsDrawerType = "none" | "add" | "edit" | "view";

const matches = (reel: ReelRecord, query: string) => reel.productName.toLowerCase().includes(query.toLowerCase());

export function useReelsManager() {
    const reels = useReelsStore((state) => state.reels);
    const addReel = useReelsStore((state) => state.addReel);
    const updateReel = useReelsStore((state) => state.updateReel);
    const deleteReel = useReelsStore((state) => state.deleteReel);
    const deleteMultipleReels = useReelsStore((state) => state.deleteMultipleReels);

    // Live store rows (a copy would miss reels added after the page opened).
    const table = useListControls(reels, matches);

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

    const openViewDrawer = useCallback((id: string) => {
        setActiveReelId(id);
        setActiveDrawer("view");
    }, []);

    // The id is kept so the drawer still shows its reel while sliding out.
    const closeDrawer = useCallback(() => setActiveDrawer("none"), []);

    const getActiveReel = useCallback((): ReelRecord | undefined => {
        if (!activeReelId) return undefined;
        return reels.find((reel) => reel.id === activeReelId);
    }, [activeReelId, reels]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this reel?")) {
            deleteReel(id);
            toast.success("Reel deleted successfully");
        }
    }, [deleteReel]);

    const { selectedIds, setSelectedIds } = table;
    const handleBulkDelete = useCallback(() => {
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} selected reels?`)) {
            deleteMultipleReels(selectedIds);
            setSelectedIds([]);
            toast.success("Selected reels deleted");
        }
    }, [selectedIds, setSelectedIds, deleteMultipleReels]);

    const handleFormSubmit = useCallback((data: ReelInput) => {
        if (activeDrawer === "add") {
            addReel(data);
            toast.success("Reel added successfully");
        } else if (activeDrawer === "edit" && activeReelId) {
            updateReel(activeReelId, data);
            toast.success("Reel updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeReelId, addReel, updateReel, closeDrawer]);

    return {
        table,
        activeDrawer,
        openAddDrawer,
        openEditDrawer,
        openViewDrawer,
        closeDrawer,
        getActiveReel,
        handleDelete,
        handleBulkDelete,
        handleFormSubmit,
    };
}

export type ReelsManagerType = ReturnType<typeof useReelsManager>;
