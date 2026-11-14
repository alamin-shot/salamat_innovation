"use client";
import { useSharedPartnerManager } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PartnerType } from "@/types/partners";
import { SharedPartnerTable } from "./SharedPartnerTable";
import { SharedPartnerDrawer } from "./SharedPartnerDrawer";
import { PartnerMetricsStrip } from "./PartnerMetricsStrip";
import { PartnerProfileDrawer } from "./PartnerProfileDrawer";
import { ApproveApplicationModal } from "./ApproveApplicationModal";

export function SharedPartnerClient({ type }: { type: PartnerType }) {
    const manager = useSharedPartnerManager(type);

    return (
        <div className="relative flex min-h-full w-full flex-col gap-4 bg-gray-50/30 p-4">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{manager.labels.many}</h1>

            <PartnerMetricsStrip metrics={manager.metrics} isApplications={manager.isApplications} totalLabel={`Total ${manager.labels.many}`} />

            <div className="erp-card flex flex-col overflow-hidden p-0 sm:p-0">
                <SharedPartnerTable manager={manager} />
            </div>

            <SharedPartnerDrawer partnerType={type} record={manager.activeEditRecord} isOpen={manager.isFormOpen} onClose={manager.closeView} />
            <PartnerProfileDrawer partner={manager.profileRecord} currentType={type} isOpen={manager.isProfileOpen} onClose={manager.closeView} />

            {manager.approvingRecord && (
                <ApproveApplicationModal application={manager.approvingRecord} onApprove={manager.handleApprove} onClose={manager.cancelApprove} />
            )}

            <ConfirmModal
                isOpen={manager.confirmModal.isOpen}
                title={manager.confirmModal.title}
                message={manager.confirmModal.message}
                onConfirm={manager.confirmModal.onConfirm}
                onCancel={manager.closeConfirm}
            />
        </div>
    );
}
