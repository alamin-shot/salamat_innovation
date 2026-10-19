"use client";
import { useAddPaymentManager } from "@/hooks/finance_hooks/useAddPaymentManager";
import { AddPaymentTable } from "./AddPaymentTable";
import { ReceivePaymentDrawer } from "./payment-drawers/ReceivePaymentDrawer";
import { SendPaymentDrawer } from "./payment-drawers/SendPaymentDrawer";

export function AddPaymentClient() {
    const manager = useAddPaymentManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Payments</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <AddPaymentTable manager={manager} />
            </div>

            <ReceivePaymentDrawer
                record={manager.activeRecord}
                isOpen={manager.activeDrawer === "receive-payment"}
                onClose={manager.closeView}
            />

            <SendPaymentDrawer
                record={manager.activeRecord}
                isOpen={manager.activeDrawer === "send-payment"}
                onClose={manager.closeView}
            />
        </div>
    );
}