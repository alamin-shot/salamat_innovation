"use client";
import { useState, useEffect } from "react";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function ReceivePaymentDrawer({ manager }: { manager: OrderManagerType }) {
    const order = manager.getActiveOrder();
    const [amount, setAmount] = useState<string>("");

    // Reset amount when a new order is opened
    useEffect(() => {
        if (order) setAmount(order.dueAmount.toString());
    }, [order]);

    if (!order) return null;

    const handleSave = () => {
        const val = parseFloat(amount);
        if (!isNaN(val) && val > 0) {
            manager.store.receivePayment(order.id, val);
            manager.closeDrawer();
        }
    };

    return (
        <Drawer
            title="Receive Amount"
            isOpen={manager.activeDrawer === "payment"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col gap-6 max-w-lg mx-auto w-full pt-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
                            <span className="text-xs text-gray-500 font-medium">Payable Amount</span>
                            <span className="text-lg font-bold text-gray-900">৳{order.payableAmount.toFixed(2)}</span>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center justify-center">
                            <span className="text-xs text-red-500 font-medium">Due Amount</span>
                            <span className="text-lg font-bold text-red-600">৳{order.dueAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Received Amount <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="erp-input text-lg font-medium"
                            placeholder="Enter received amount"
                        />
                        <span className="text-xs text-gray-400 mt-1">
                            Max: ৳{order.dueAmount.toFixed(2)} | Due after save: ৳{Math.max(0, order.dueAmount - parseFloat(amount || "0")).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSave} className="px-8 h-9" disabled={!amount || parseFloat(amount) <= 0}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}