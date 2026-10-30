"use client";
import { useState, useCallback } from "react";
import { useProductVerifyStore, ProductVerifyRequest, VerifyStatus } from "@/store/useProductVerifyStore";
import { toast } from "sonner";

export function useProductVerifyManager() {
    const store = useProductVerifyStore();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveRequest = useCallback((): ProductVerifyRequest | undefined => {
        if (!activeRequestId) return undefined;
        return store.requests.find(r => r.id === activeRequestId);
    }, [activeRequestId, store.requests]);

    const openDrawer = useCallback((id: string) => {
        setActiveRequestId(id);
        setIsDrawerOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setTimeout(() => setActiveRequestId(null), 300);
    }, []);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this verification request?")) {
            store.deleteRequest(id);
            toast.success("Request deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} requests?`)) {
            store.bulkDeleteRequests(selectedIds);
            setSelectedIds([]);
            toast.success("Requests deleted");
        }
    }, [selectedIds, store]);

    const handleStatusUpdate = useCallback((id: string, status: VerifyStatus) => {
        store.updateStatus(id, status);
        toast.success(`Verification marked as ${status}`);
    }, [store]);

    return {
        requests: store.requests,
        isDrawerOpen,
        activeRequestId,
        selectedIds,
        setSelectedIds,
        getActiveRequest,
        openDrawer,
        closeDrawer,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate
    };
}

export type ProductVerifyManagerType = ReturnType<typeof useProductVerifyManager>;