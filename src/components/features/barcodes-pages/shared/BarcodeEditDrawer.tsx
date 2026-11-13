"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { BarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodeEditInput, BarcodesTabKey } from "@/types/barcodes";
import { BarcodeEditForm } from "./BarcodeEditForm";

type EditManager = Pick<
    BarcodesManager<BarcodesTabKey>,
    "drawerMode" | "activeBarcode" | "closeDrawer" | "handleUpdate" | "canEditRecord" | "canEditLocation"
>;

interface BarcodeEditDrawerProps {
    manager: EditManager;
}

/** Edit drawer for Barcode List and Generate Barcode (MRP and pre-receipt Location). */
export function BarcodeEditDrawer({ manager }: BarcodeEditDrawerProps) {
    const isOpen = manager.drawerMode === "edit-barcode"
        && manager.activeBarcode !== null
        && manager.canEditRecord(manager.activeBarcode);
    const barcode = useRetainedValue(manager.activeBarcode, isOpen);

    const handleSubmit = (changes: BarcodeEditInput) => {
        if (barcode && manager.handleUpdate(barcode.id, changes)) {
            manager.closeDrawer();
        }
    };

    return (
        <Drawer
            title="Edit Barcode"
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {barcode && (
                <BarcodeEditForm
                    key={barcode.id}
                    barcode={barcode}
                    canEditLocation={manager.canEditLocation(barcode)}
                    onSubmit={handleSubmit}
                    onCancel={manager.closeDrawer}
                />
            )}
        </Drawer>
    );
}
