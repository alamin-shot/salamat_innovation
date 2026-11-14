"use client";
import { usePaymentListManager } from "@/hooks/finance_hooks/payments/usePaymentListManager";
import { PaymentListTable } from "./PaymentListTable";
import { DebitVoucherDrawer } from "./voucher-drawer/DebitVoucherDrawer";

export function PaymentListClient() {
    const manager = usePaymentListManager();

    return (
        <div className="relative flex min-h-full w-full flex-col p-4">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-brand-text sm:text-2xl">Payment List</h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-brand-subtext/20 bg-white shadow-sm">
                <PaymentListTable manager={manager} />
            </div>

            <DebitVoucherDrawer record={manager.activeVoucherRecord} isOpen={manager.isVoucherOpen} onClose={manager.closeView} />
        </div>
    );
}
