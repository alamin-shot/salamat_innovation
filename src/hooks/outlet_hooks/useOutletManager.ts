"use client";
import { useState, useCallback } from "react";
import { useOutletStore, Outlet, OutletStatus } from "@/store/useOutletStore";
import { toast } from "sonner";

export type OutletDrawerState = "none" | "add" | "edit";

export function useOutletManager() {
    const store = useOutletStore();

    const [activeDrawer, setActiveDrawer] = useState<OutletDrawerState>("none");
    const [activeOutletId, setActiveOutletId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveOutlet = useCallback((): Outlet | undefined => {
        if (!activeOutletId) return undefined;
        return store.outlets.find(o => o.id === activeOutletId);
    }, [activeOutletId, store.outlets]);

    const openAddDrawer = useCallback(() => {
        setActiveOutletId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveOutletId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveOutletId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<Outlet, "id" | "createdAt">) => {
        if (activeDrawer === "edit" && activeOutletId) {
            store.updateOutlet(activeOutletId, formData);
            toast.success("Outlet updated successfully");
        } else if (activeDrawer === "add") {
            store.addOutlet(formData);
            toast.success("New outlet created");
        }
        closeDrawer();
    }, [activeDrawer, activeOutletId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this outlet?")) {
            store.deleteOutlet(id);
            toast.success("Outlet deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} outlets?`)) {
            store.bulkDeleteOutlets(selectedIds);
            setSelectedIds([]);
            toast.success("Outlets deleted");
        }
    }, [selectedIds, store]);

    const handleToggleStatus = useCallback((id: string) => {
        const outlet = store.outlets.find(o => o.id === id);
        if (outlet) {
            const newStatus = outlet.status === "Active" ? "Inactive" : "Active";
            store.updateStatus(id, newStatus);
            toast.success(`Outlet marked as ${newStatus}`);
        }
    }, [store]);

    return {
        outlets: store.outlets,
        activeDrawer,
        activeOutletId,
        selectedIds,
        setSelectedIds,
        getActiveOutlet,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleToggleStatus
    };
}

export type OutletManagerType = ReturnType<typeof useOutletManager>;