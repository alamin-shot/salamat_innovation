"use client";
import { usePaymentListManager } from "@/hooks/finance_hooks/payments/usePaymentListManager";
import { PaymentListTable } from "./PaymentListTable";
import { DebitVoucherDrawer } from "./voucher-drawer/DebitVoucherDrawer";

export function PaymentListClient() {
    const manager = usePaymentListManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Payment List</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <PaymentListTable manager={manager} />
            </div>

            <DebitVoucherDrawer
                record={manager.activeVoucherRecord}
                isOpen={manager.activeDrawer === "view-voucher"}
                onClose={manager.closeView}
            />
        </div>
    );
}