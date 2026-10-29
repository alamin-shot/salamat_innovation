"use client";
import { useState, useCallback } from "react";
import { useGenericEntityStore, GenericEntity } from "@/store/useGenericEntityStore";
import { toast } from "sonner";

export type GenericDrawerState = "none" | "add" | "edit";

export function useGenericManager(moduleKey: string) {
    const store = useGenericEntityStore();

    // UI Routing State
    const [activeDrawer, setActiveDrawer] = useState<GenericDrawerState>("none");
    const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Data Retrieval
    const data = store.entities[moduleKey] || [];
    const getActiveEntity = useCallback((): GenericEntity | undefined => {
        if (!activeEntityId) return undefined;
        return data.find(e => e.id === activeEntityId);
    }, [activeEntityId, data]);

    // Drawer Handlers
    const openAddDrawer = useCallback(() => {
        setActiveEntityId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveEntityId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveEntityId(null), 300);
    }, []);

    // Submission & Deletion Handlers
    const handleSubmit = useCallback((formData: Omit<GenericEntity, "id">) => {
        if (activeDrawer === "add") {
            store.addEntity(moduleKey, formData);
            toast.success("Record created successfully");
        } else if (activeDrawer === "edit" && activeEntityId) {
            store.updateEntity(moduleKey, activeEntityId, formData);
            toast.success("Record updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeEntityId, moduleKey, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this record?")) {
            store.deleteEntity(moduleKey, id);
            toast.success("Record deleted");
        }
    }, [moduleKey, store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
            store.bulkDeleteEntities(moduleKey, selectedIds);
            setSelectedIds([]);
            toast.success("Records deleted");
        }
    }, [moduleKey, selectedIds, store]);

    return {
        data,
        activeDrawer,
        activeEntityId,
        selectedIds,
        setSelectedIds,
        getActiveEntity,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete
    };
}

export type GenericManagerType = ReturnType<typeof useGenericManager>;