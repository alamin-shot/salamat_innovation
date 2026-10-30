"use client";
import { useState, useCallback } from "react";
import { useWarrantyStore, WarrantyRequest, WarrantyStatus } from "@/store/useWarrantyStore";
import { toast } from "sonner";

export type WarrantyDrawerState = "none" | "view_edit";

export function useWarrantyManager() {
    const store = useWarrantyStore();

    const [activeDrawer, setActiveDrawer] = useState<WarrantyDrawerState>("none");
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveRequest = useCallback((): WarrantyRequest | undefined => {
        if (!activeRequestId) return undefined;
        return store.requests.find(r => r.id === activeRequestId);
    }, [activeRequestId, store.requests]);

    const openDrawer = useCallback((id: string) => {
        setActiveRequestId(id);
        setActiveDrawer("view_edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveRequestId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Partial<WarrantyRequest>) => {
        if (activeDrawer === "view_edit" && activeRequestId) {
            store.updateRequest(activeRequestId, formData);
            toast.success("Warranty ticket updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeRequestId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this warranty request?")) {
            store.deleteRequest(id);
            toast.success("Warranty request deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} warranty requests?`)) {
            store.bulkDeleteRequests(selectedIds);
            setSelectedIds([]);
            toast.success("Requests deleted");
        }
    }, [selectedIds, store]);

    const handleStatusUpdate = useCallback((id: string, status: WarrantyStatus) => {
        store.updateStatus(id, status);
        toast.success(`Ticket marked as ${status}`);
    }, [store]);

    return {
        requests: store.requests,
        activeDrawer,
        activeRequestId,
        selectedIds,
        setSelectedIds,
        getActiveRequest,
        openDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate
    };
}

export type WarrantyManagerType = ReturnType<typeof useWarrantyManager>;