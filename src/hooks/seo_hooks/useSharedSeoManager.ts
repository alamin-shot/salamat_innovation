"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useSeoStore, SeoRecord, SeoPlatform, SeoTabType } from "@/store/useSeoStore";

const matchesRecord = (item: SeoRecord, query: string): boolean =>
    item.name.toLowerCase().includes(query.toLowerCase()) || item.slug.toLowerCase().includes(query.toLowerCase());

/** One Page Metadata section (from its route /admin/seo/page-metadata/<section>) for one storefront. */
export function useSharedSeoManager(platform: SeoPlatform, section: SeoTabType) {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { records, deleteRecord, updateRecord, bulkDeleteRecords } = useSeoStore();
    const currentTab: SeoTabType = section;

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