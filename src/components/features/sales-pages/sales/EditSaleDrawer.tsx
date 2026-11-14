"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { SaleRow } from "@/types/sales";
import { EditSaleForm } from "./EditSaleForm";

interface EditSaleDrawerProps {
    sale: SaleRow | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditSaleDrawer({ sale, isOpen, onClose }: EditSaleDrawerProps) {
    return (
        <Drawer title={sale ? `Update Sale ${sale.invoiceNumber}` : "Update Sale"} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {sale && (
                <div className="pb-32">
                    <EditSaleForm key={sale.id} sale={sale} onDone={onClose} />
                </div>
            )}
        </Drawer>
    );
}
