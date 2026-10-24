"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { usePartnerStore, Partner, PartnerType } from "@/store/usePartnerStore";

export function useSharedPartnerManager(partnerType: PartnerType) {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { partners, deletePartner, bulkDeletePartners, updateStatus } = usePartnerStore();

    // Filter store data by the current page's partner type
    const typeFilteredPartners = useMemo(() => partners.filter(p => p.type === partnerType), [partners, partnerType]);

    // Drawer State Management (Fixed retaining old ID bug)
    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);
    useEffect(() => {
        if (activeDrawer === "partner-form") setRetainedEditId(activeId || null);
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: Partner, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.businessName.toLowerCase().includes(query.toLowerCase()) ||
        item.primaryPhone.includes(query)
        , []);

    const table = useTableManager<Partner>(typeFilteredPartners, filterFn);

    // Sync table data when store updates
    useEffect(() => { table.setData(typeFilteredPartners); }, [typeFilteredPartners]);

    const activeEditRecord = useMemo(() => typeFilteredPartners.find((p) => p.id === retainedEditId) || null, [typeFilteredPartners, retainedEditId]);

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        customer: true, businessName: true, primaryPhone: true,
        secondaryPhone: false, email: true, tradeLicense: false,
        address: true, status: true
    });

    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ customer: true, businessName: true, primaryPhone: true, secondaryPhone: true, email: true, tradeLicense: true, address: true, status: true });

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({
        isOpen: false, title: "", message: "", onConfirm: () => { }
    });
    const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    const handleAdd = () => {
        setRetainedEditId(null); // Clear old data for Add Mode
        openView("drawer", "partner-form");
    };
    const handleView = (id: string) => toast.info(`Viewing details for ${partnerType} ${id}`);
    const handleEdit = (id: string) => openView("drawer", "partner-form", id);

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Partner",
            message: "Are you sure you want to permanently delete this partner? This action cannot be undone.",
            onConfirm: () => {
                deletePartner(id);
                table.setSelectedIds((p) => p.filter((i) => i !== id));
                toast.success("Partner deleted.");
                closeConfirm();
            }
        });
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        setConfirmModal({
            isOpen: true,
            title: "Delete Selected Partners",
            message: `Are you sure you want to permanently delete ${table.selectedIds.length} partners?`,
            onConfirm: () => {
                bulkDeletePartners(table.selectedIds);
                table.clearSelection();
                toast.success("Selected partners deleted.");
                closeConfirm();
            }
        });
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateStatus(id, newStatus);
        toast.success(`Status updated to ${newStatus}`);
    };

    return {
        partnerType, activeDrawer, closeView, activeEditRecord, table,
        cols, showColumnsMenu, setShowColumnsMenu, toggleColumn, showAllColumns,
        handleAdd, handleView, handleEdit, handleDelete, handleBulkDelete, handleStatusChange,
        confirmModal, closeConfirm
    };
}

export type SharedPartnerManagerType = ReturnType<typeof useSharedPartnerManager>;