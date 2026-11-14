"use client";
import { useAddPaymentManager } from "@/hooks/finance_hooks/payments/useAddPaymentManager";
import { AddPaymentTable } from "./AddPaymentTable";
import { PaymentEntryDrawer } from "./payment-drawers/PaymentEntryDrawer";

export function AddPaymentClient() {
    const manager = useAddPaymentManager();

    return (
        <div className="relative flex min-h-full w-full flex-col p-4">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-brand-text sm:text-2xl">Payments</h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-brand-subtext/20 bg-white shadow-sm">
                <AddPaymentTable manager={manager} />
            </div>

            <PaymentEntryDrawer direction={manager.direction} record={manager.activeRecord} isOpen={manager.isPaymentOpen} onClose={manager.closeView} />
        </div>
    );
}
