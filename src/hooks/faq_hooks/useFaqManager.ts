"use client";
import { useState, useCallback } from "react";
import { useFaqStore, Faq, FaqStatus } from "@/store/useFaqStore";
import { toast } from "sonner";

export type FaqDrawerState = "none" | "add" | "edit";

export function useFaqManager() {
    const store = useFaqStore();

    const [activeDrawer, setActiveDrawer] = useState<FaqDrawerState>("none");
    const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveFaq = useCallback((): Faq | undefined => {
        if (!activeFaqId) return undefined;
        return store.faqs.find(f => f.id === activeFaqId);
    }, [activeFaqId, store.faqs]);

    const openAddDrawer = useCallback(() => {
        setActiveFaqId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveFaqId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveFaqId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<Faq, "id" | "views" | "createdAt">) => {
        if (activeDrawer === "edit" && activeFaqId) {
            store.updateFaq(activeFaqId, formData);
            toast.success("FAQ updated successfully");
        } else if (activeDrawer === "add") {
            store.addFaq(formData);
            toast.success("New FAQ created");
        }
        closeDrawer();
    }, [activeDrawer, activeFaqId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            store.deleteFaq(id);
            toast.success("FAQ deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} FAQs?`)) {
            store.bulkDeleteFaqs(selectedIds);
            setSelectedIds([]);
            toast.success("FAQs deleted");
        }
    }, [selectedIds, store]);

    const handleToggleStatus = useCallback((id: string) => {
        const faq = store.faqs.find(f => f.id === id);
        if (faq) {
            const newStatus = faq.status === "Active" ? "Inactive" : "Active";
            store.updateStatus(id, newStatus);
            toast.success(`FAQ marked as ${newStatus}`);
        }
    }, [store]);

    return {
        faqs: store.faqs,
        activeDrawer,
        activeFaqId,
        selectedIds,
        setSelectedIds,
        getActiveFaq,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleToggleStatus
    };
}

export type FaqManagerType = ReturnType<typeof useFaqManager>;