"use client";
import { useWithdrawalManager } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalManager";
import { WithdrawalTable } from "./WithdrawalTable";
import { WithdrawalFormDrawer } from "./form-drawer/WithdrawalFormDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function WithdrawalClient() {
    const manager = useWithdrawalManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Withdrawal</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <WithdrawalTable manager={manager} />
            </div>
            <WithdrawalFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-withdrawal"}
                onClose={manager.closeView}
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