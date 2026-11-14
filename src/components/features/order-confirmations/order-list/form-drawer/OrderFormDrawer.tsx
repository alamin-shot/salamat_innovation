"use client";
import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useOrderFormManager } from "@/hooks/order_confirmation_hooks/useOrderFormManager";
import { OrderItem } from "@/hooks/order_confirmation_hooks/useOrderListStore";
import { OrderFormFields } from "./OrderFormFields";

interface OrderFormDrawerProps {
    mode: "create" | "edit";
    id?: string | null;
    initialRecord?: OrderItem | null;
    isOpen: boolean;
    onClose: () => void;
}

/** Form body: mounted only while the drawer is open, so every opening starts from the record (or empty). */
function OrderFormBody({ mode, initialRecord, onClose }: Omit<OrderFormDrawerProps, "isOpen" | "id">) {
    const manager = useOrderFormManager(mode, initialRecord, onClose);

    return (
        <div className="flex flex-col gap-2 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
            <OrderFormFields manager={manager} />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={onClose} className="px-6 text-gray-700 hover:bg-gray-50">
                    Cancel
                </Button>
                <Button type="button" variant="success" onClick={manager.handleSave} className="px-6">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save
                </Button>
            </div>
        </div>
    );
}

export function OrderFormDrawer({ mode, initialRecord, isOpen, onClose }: OrderFormDrawerProps) {
    return (
        <Drawer
            title={mode === "edit" ? "Update Order" : "Add Order"}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {isOpen && (
                <div className="pb-32">
                    <OrderFormBody key={initialRecord?.id ?? "new"} mode={mode} initialRecord={initialRecord} onClose={onClose} />
                </div>
            )}
        </Drawer>
    );
}
