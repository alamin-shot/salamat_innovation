"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useSeoStore, SeoRecord, SeoPlatform, SeoTabType } from "@/store/useSeoStore";

export function useSharedSeoManager(platform: SeoPlatform) {
    const { activeDrawer, activeId, activeTab, openView, closeView } = useCommandParams();
    const { records, deleteRecord, updateRecord, bulkDeleteRecords } = useSeoStore();

    // Default to 'pages' if tab is missing
    const currentTab = (activeTab as SeoTabType) || "pages";

    // Strict useMemo prevents infinite render loops when route changes
    const filteredRecords = useMemo(() => {
        return records.filter((r) => r.platform === platform && r.type === currentTab);
    }, [records, platform, currentTab]);

    const table = useTableManager<SeoRecord>(filteredRecords, (item, query) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.slug.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        table.setData(filteredRecords);
    }, [filteredRecords]);

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