import { useState, useCallback } from "react";
import { useSellDeviceStore } from "@/store/useSellDeviceStore";
import { SellDeviceRequest, SellDeviceStatus } from "@/types/sellDevice";
import { toast } from "sonner";

/** view_edit = status / note drawer; inspect = read-only inspection drawer. */
export type SellDeviceDrawerState = "none" | "view_edit" | "inspect";

export function useSellDeviceManager() {
    const store = useSellDeviceStore();

    const [activeDrawer, setActiveDrawer] = useState<SellDeviceDrawerState>("none");
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveRequest = useCallback((): SellDeviceRequest | undefined => {
        if (!activeRequestId) return undefined;
        return store.requests.find(r => r.id === activeRequestId);
    }, [activeRequestId, store.requests]);

    const openDrawer = useCallback((id: string) => {
        setActiveRequestId(id);
        setActiveDrawer("view_edit");
    }, []);

    const openInspect = useCallback((id: string) => {
        setActiveRequestId(id);
        setActiveDrawer("inspect");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveRequestId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Partial<SellDeviceRequest>) => {
        if (activeDrawer === "view_edit" && activeRequestId) {
            store.updateRequest(activeRequestId, formData);
            toast.success("Sell device request updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeRequestId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this request?")) {
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

    const handleStatusUpdate = useCallback((id: string, status: SellDeviceStatus) => {
        store.updateStatus(id, status);
        toast.success(`Request marked as ${status}`);
    }, [store]);

    return {
        requests: store.requests,
        activeDrawer,
        activeRequestId,
        selectedIds,
        setSelectedIds,
        getActiveRequest,
        openDrawer,
        openInspect,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate
    };
}

export type SellDeviceManagerType = ReturnType<typeof useSellDeviceManager>;