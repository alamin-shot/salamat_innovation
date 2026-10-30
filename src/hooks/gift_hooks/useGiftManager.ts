"use client";
import { useState, useCallback } from "react";
import { useGiftStore, GiftRule } from "@/store/useGiftStore";
import { toast } from "sonner";

export type GiftDrawerState = "none" | "add" | "edit";

export function useGiftManager() {
    const store = useGiftStore();

    const [activeDrawer, setActiveDrawer] = useState<GiftDrawerState>("none");
    const [activeGiftId, setActiveGiftId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveGift = useCallback((): GiftRule | undefined => {
        if (!activeGiftId) return undefined;
        return store.gifts.find(g => g.id === activeGiftId);
    }, [activeGiftId, store.gifts]);

    const openAddDrawer = useCallback(() => {
        setActiveGiftId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveGiftId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveGiftId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<GiftRule, "id">) => {
        if (!formData.primaryProductName || !formData.giftProductName) {
            toast.error("Both Primary and Gift products must be selected");
            return;
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error("End date must be after start date");
            return;
        }

        if (activeDrawer === "add") {
            store.addGift(formData);
            toast.success("Gift rule created successfully");
        } else if (activeDrawer === "edit" && activeGiftId) {
            store.updateGift(activeGiftId, formData);
            toast.success("Gift rule updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeGiftId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this gift rule?")) {
            store.deleteGift(id);
            toast.success("Gift rule deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} gift rules?`)) {
            store.bulkDeleteGifts(selectedIds);
            setSelectedIds([]);
            toast.success("Gift rules deleted");
        }
    }, [selectedIds, store]);

    const handleToggleStatus = useCallback((id: string) => {
        store.toggleStatus(id);
        toast.success("Status updated");
    }, [store]);

    return {
        gifts: store.gifts,
        activeDrawer,
        activeGiftId,
        selectedIds,
        setSelectedIds,
        getActiveGift,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleToggleStatus
    };
}

export type GiftManagerType = ReturnType<typeof useGiftManager>;