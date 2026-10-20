"use client";
import { useDepositManager } from "@/hooks/finance_hooks/deposit_hooks/useDepositManager";
import { DepositTable } from "./DepositTable";
import { DepositFormDrawer } from "./form-drawer/DepositFormDrawer";

export function DepositClient() {
    const manager = useDepositManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Deposit</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <DepositTable manager={manager} />
            </div>
            <DepositFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-deposit"}
                onClose={manager.closeView}
            />
        </div>
    );
}