"use client";
import { useSharedPartnerManager } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";
import { useSharedPartnerForm } from "@/hooks/partner_hooks/shared/useSharedPartnerForm";
import { SharedPartnerTable } from "./SharedPartnerTable";
import { SharedPartnerDrawer } from "./SharedPartnerDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PartnerType } from "@/store/usePartnerStore";

export function SharedPartnerClient({ type }: { type: PartnerType }) {
    const manager = useSharedPartnerManager(type);


    const formManager = useSharedPartnerForm(type, manager.activeEditRecord, manager.closeView);

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-gray-50/30">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">{type} List</h1>
            </div>

            <div className="erp-card overflow-hidden flex-1 flex flex-col p-0 sm:p-0">
                <SharedPartnerTable manager={manager} />
            </div>

            <SharedPartnerDrawer
                partnerType={type}
                isEdit={Boolean(manager.activeEditRecord)}
                isOpen={manager.activeDrawer === "partner-form"}
                onClose={manager.closeView}
                form={formManager}
            />

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