"use client";
import { useState, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useSeoStore, SeoRecord, SeoPlatform, SeoTabType } from "@/store/useSeoStore";

const SEO_SECTIONS: readonly SeoTabType[] = ["pages", "products", "categories", "brands"];

const matchesRecord = (item: SeoRecord, query: string): boolean =>
    item.name.toLowerCase().includes(query.toLowerCase()) || item.slug.toLowerCase().includes(query.toLowerCase());

export function useSharedSeoManager(platform: SeoPlatform) {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { records, deleteRecord, updateRecord, bulkDeleteRecords } = useSeoStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Pages / Products / Categories / Brands live in `?section=` (the SEO hub owns `?tab=`).
    const requestedSection = searchParams.get("section");
    const currentTab: SeoTabType = SEO_SECTIONS.find((section) => section === requestedSection) ?? "pages";

    const setSection = useCallback((section: SeoTabType) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("section", section);
        ["drawer", "id", "page", "search"].forEach((key) => params.delete(key));
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    // Strict useMemo prevents infinite render loops when route changes
    const filteredRecords = useMemo(() => {
        return records.filter((r) => r.platform === platform && r.type === currentTab);
    }, [records, platform, currentTab]);

    // Live list: store changes show immediately, no copy to keep in sync.
    const table = useListControls<SeoRecord>(filteredRecords, matchesRecord);

    const activeEditRecord = useMemo(() => {
        return filteredRecords.find((r) => r.id === activeId) || null;
    }, [filteredRecords, activeId]);

    // Deletion Modal State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => { } });
    const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete SEO Record",
            message: "Are you sure you want to permanently delete this SEO configuration?",
            onConfirm: () => {
                deleteRecord(id);
                table.setSelectedIds(p => p.filter(i => i !== id));
                toast.success("Record deleted successfully.");
                closeConfirm();
            }
        });
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteRecords(table.selectedIds);
        table.clearSelection();
        toast.success("Selected records deleted.");
    };

    const handleInlineStatusChange = (id: string, newStatus: "Active" | "Inactive") => {
        updateRecord(id, { status: newStatus });
        toast.success(`Status updated to ${newStatus}`);
    };

    return {
        platform,
        currentTab,
        setSection,
        table,
        activeDrawer,
        activeEditRecord,
        openView,
        closeView,
        handleDelete,
        handleBulkDelete,
        handleInlineStatusChange,
        confirmModal,
        closeConfirm
    };
}

export type SharedSeoManagerType = ReturnType<typeof useSharedSeoManager>;