"use client";
import { useState, useCallback } from "react";
import { useCareerStore, Career, CareerStatus } from "@/store/useCareerStore";
import { toast } from "sonner";

export type CareerDrawerState = "none" | "add" | "edit";

export function useCareerManager() {
    const store = useCareerStore();

    const [activeDrawer, setActiveDrawer] = useState<CareerDrawerState>("none");
    const [activeCareerId, setActiveCareerId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveCareer = useCallback((): Career | undefined => {
        if (!activeCareerId) return undefined;
        return store.careers.find(c => c.id === activeCareerId);
    }, [activeCareerId, store.careers]);

    const openAddDrawer = useCallback(() => {
        setActiveCareerId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveCareerId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveCareerId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<Career, "id" | "createdAt">) => {
        if (activeDrawer === "edit" && activeCareerId) {
            store.updateCareer(activeCareerId, formData);
            toast.success("Job posting updated successfully");
        } else if (activeDrawer === "add") {
            store.addCareer(formData);
            toast.success("New job posting created");
        }
        closeDrawer();
    }, [activeDrawer, activeCareerId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this job posting?")) {
            store.deleteCareer(id);
            toast.success("Job posting deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} job postings?`)) {
            store.bulkDeleteCareers(selectedIds);
            setSelectedIds([]);
            toast.success("Job postings deleted");
        }
    }, [selectedIds, store]);

    const handleToggleStatus = useCallback((id: string) => {
        const career = store.careers.find(c => c.id === id);
        if (career) {
            const newStatus = career.status === "Active" ? "Inactive" : "Active";
            store.updateStatus(id, newStatus);
            toast.success(`Job marked as ${newStatus}`);
        }
    }, [store]);

    return {
        careers: store.careers,
        activeDrawer,
        activeCareerId,
        selectedIds,
        setSelectedIds,
        getActiveCareer,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleToggleStatus
    };
}

export type CareerManagerType = ReturnType<typeof useCareerManager>;