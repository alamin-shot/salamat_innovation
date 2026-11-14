"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { EditPurchaseForm } from "./EditPurchaseForm";

interface EditPurchaseDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPurchaseDrawer({ id, isOpen, onClose }: EditPurchaseDrawerProps) {
    const purchase = useGlobalPurchasesStore((state) => state.purchases.find((record) => record.id === id) ?? null);

    return (
        <Drawer title="Edit Purchase" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {purchase ? (
                // A fresh form per record, so its draft always starts from that record's saved values.
                <EditPurchaseForm key={purchase.id} purchase={purchase} onCancel={onClose} onSaved={onClose} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <h3 className="text-sm font-bold text-brand-text">Purchase not found</h3>
                    <p className="text-xs text-brand-subtext">It may have been deleted.</p>
                </div>
            )}
        </Drawer>
    );
}
