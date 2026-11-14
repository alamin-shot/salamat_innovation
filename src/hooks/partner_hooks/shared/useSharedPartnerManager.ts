import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { usePartnerStore } from "@/store/usePartnerStore";
import { ApprovedPartnerType, Partner, PartnerType } from "@/types/partners";
import { PARTNER_TYPE_LABELS } from "@/constants/partners";
import { partnerMetrics } from "@/utils/partnerRules";

const COLUMNS = { customer: true, tier: true, businessName: true, primaryPhone: true, secondaryPhone: false, email: true, tradeLicense: false, address: true, status: true };
export type PartnerColumns = typeof COLUMNS;

const matches = (item: Partner, query: string) => {
    const q = query.toLowerCase();
    return [item.name, item.businessName, item.primaryPhone, item.email, item.tier].some((text) => text.toLowerCase().includes(q));
};

/** One partner list (dealers, retailers, B2B, franchises or applications). */
export function useSharedPartnerManager(partnerType: PartnerType) {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const partners = usePartnerStore((state) => state.partners);
    const { deletePartner, bulkDeletePartners, updateStatus, approveApplication, rejectApplication } = usePartnerStore.getState();

    const rows = useMemo(() => partners.filter((partner) => partner.type === partnerType), [partners, partnerType]);
    const metrics = useMemo(() => partnerMetrics(rows), [rows]);
    const table = useListControls(rows, matches);

    const isFormOpen = activeDrawer === "partner-form";
    const isProfileOpen = activeDrawer === "partner-profile" && !!activeId;
    const formId = useRetainedValue(isFormOpen ? activeId : null, isFormOpen);
    const profileId = useRetainedValue(isProfileOpen ? activeId : null, isProfileOpen);

    /** Application waiting for "Approve as…". */
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const [cols, setCols] = useState(COLUMNS);
    const toggleColumn = (key: string) => {
        if (key in COLUMNS) setCols((prev) => ({ ...prev, [key]: !prev[key as keyof PartnerColumns] }));
    };

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
        isOpen: false, title: "", message: "", onConfirm: () => { },
    });
    const closeConfirm = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const { setSelectedIds } = table;
    const handleDelete = useCallback((id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Partner",
            message: "Are you sure you want to permanently delete this partner? This action cannot be undone.",
            onConfirm: () => {
                deletePartner(id);
                setSelectedIds((prev) => prev.filter((selected) => selected !== id));
                toast.success("Partner deleted.");
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    }, [deletePartner, setSelectedIds]);

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
            },
        });
    };

    const handleToggleStatus = useCallback((partner: Partner) => {
        const next = partner.status === "Active" ? "Inactive" : "Active";
        updateStatus(partner.id, next);
        toast.success(`${partner.name} is now ${next}.`);
    }, [updateStatus]);

    const handleApprove = (type: ApprovedPartnerType) => {
        const application = rows.find((row) => row.id === approvingId);
        if (!application) return;
        approveApplication(application.id, type);
        setApprovingId(null);
        toast.success(`${application.name} approved as ${PARTNER_TYPE_LABELS[type].one}.`);
    };

    const handleReject = useCallback((partner: Partner) => {
        rejectApplication(partner.id);
        toast.success(`${partner.name}'s application rejected.`);
    }, [rejectApplication]);

    return {
        partnerType,
        labels: PARTNER_TYPE_LABELS[partnerType],
        isApplications: partnerType === "application",
        metrics,
        table,
        cols,
        toggleColumn,
        showAllColumns: () => setCols(Object.fromEntries(Object.keys(COLUMNS).map((key) => [key, true])) as PartnerColumns),
        isFormOpen,
        isProfileOpen,
        activeEditRecord: rows.find((row) => row.id === formId) ?? null,
        profileRecord: partners.find((partner) => partner.id === profileId) ?? null,
        closeView,
        handleAdd: () => openView("drawer", "partner-form"),
        handleView: useCallback((id: string) => openView("drawer", "partner-profile", id), [openView]),
        handleEdit: useCallback((id: string) => openView("drawer", "partner-form", id), [openView]),
        handleDelete,
        handleBulkDelete,
        handleToggleStatus,
        approvingRecord: rows.find((row) => row.id === approvingId) ?? null,
        startApprove: useCallback((id: string) => setApprovingId(id), []),
        cancelApprove: () => setApprovingId(null),
        handleApprove,
        handleReject,
        confirmModal,
        closeConfirm,
    };
}

export type SharedPartnerManagerType = ReturnType<typeof useSharedPartnerManager>;
