"use client";
import { useState, useCallback } from "react";
import { useOffersStore, Offer } from "@/store/useOffersStore";
import { toast } from "sonner";

export type OffersDrawerState = "none" | "add" | "edit";

export function useOffersManager() {
    const store = useOffersStore();

    // UI Routing State
    const [activeDrawer, setActiveDrawer] = useState<OffersDrawerState>("none");
    const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveOffer = useCallback((): Offer | undefined => {
        if (!activeOfferId) return undefined;
        return store.offers.find(o => o.id === activeOfferId);
    }, [activeOfferId, store.offers]);

    const openAddDrawer = useCallback(() => {
        setActiveOfferId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveOfferId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveOfferId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<Offer, "id">) => {
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error("End date must be after start date");
            return;
        }

        if (activeDrawer === "add") {
            store.addOffer(formData);
            toast.success("Offer created successfully");
        } else if (activeDrawer === "edit" && activeOfferId) {
            store.updateOffer(activeOfferId, formData);
            toast.success("Offer updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeOfferId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this offer?")) {
            store.deleteOffer(id);
            toast.success("Offer deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} offers?`)) {
            store.bulkDeleteOffers(selectedIds);
            setSelectedIds([]);
            toast.success("Offers deleted");
        }
    }, [selectedIds, store]);

    return {
        offers: store.offers,
        activeDrawer,
        activeOfferId,
        selectedIds,
        setSelectedIds,
        getActiveOffer,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete
    };
}

export type OffersManagerType = ReturnType<typeof useOffersManager>;