"use client";
import { useState, useCallback } from "react";
import { useApplicantStore, Applicant, ApplicantStatus } from "@/store/useApplicantStore";
import { toast } from "sonner";

export type ApplicantDrawerState = "none" | "view";

export function useApplicantManager() {
    const store = useApplicantStore();

    const [activeDrawer, setActiveDrawer] = useState<ApplicantDrawerState>("none");
    const [activeApplicantId, setActiveApplicantId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveApplicant = useCallback((): Applicant | undefined => {
        if (!activeApplicantId) return undefined;
        return store.applicants.find(a => a.id === activeApplicantId);
    }, [activeApplicantId, store.applicants]);

    const openDrawer = useCallback((id: string) => {
        setActiveApplicantId(id);
        setActiveDrawer("view");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveApplicantId(null), 300);
    }, []);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this applicant?")) {
            store.deleteApplicant(id);
            toast.success("Applicant deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} applicants?`)) {
            store.bulkDeleteApplicants(selectedIds);
            setSelectedIds([]);
            toast.success("Applicants deleted");
        }
    }, [selectedIds, store]);

    const handleStatusUpdate = useCallback((id: string, status: ApplicantStatus) => {
        store.updateStatus(id, status);
        toast.success(`Applicant marked as ${status}`);
    }, [store]);

    return {
        applicants: store.applicants,
        activeDrawer,
        activeApplicantId,
        selectedIds,
        setSelectedIds,
        getActiveApplicant,
        openDrawer,
        closeDrawer,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate
    };
}

export type ApplicantManagerType = ReturnType<typeof useApplicantManager>;