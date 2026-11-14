"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { EditPurchaseReturnForm } from "./EditPurchaseReturnForm";

interface EditPurchaseReturnDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPurchaseReturnDrawer({ id, isOpen, onClose }: EditPurchaseReturnDrawerProps) {
    const record = useGlobalPurchasesStore((state) => state.purchaseReturns.find((item) => item.id === id) ?? null);

    return (
        <Drawer title="Update Purchase Return" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record ? (
                <EditPurchaseReturnForm key={record.id} record={record} onCancel={onClose} onSaved={onClose} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <h3 className="text-sm font-bold text-brand-text">Purchase return not found</h3>
                    <p className="text-xs text-brand-subtext">It may have been deleted.</p>
                </div>
            )}
        </Drawer>
    );
}
