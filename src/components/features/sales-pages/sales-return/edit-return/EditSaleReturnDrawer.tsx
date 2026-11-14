"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useSaleReturnForm } from "@/hooks/sales_hooks/useSaleReturnForm";
import { SaleReturn } from "@/types/sales";
import { SaleReturnEditor } from "../../return-editor/SaleReturnEditor";

function EditSaleReturnBody({ record, onDone }: { record: SaleReturn; onDone: () => void }) {
    const form = useSaleReturnForm(record, onDone);
    return <SaleReturnEditor form={form} />;
}

/** Edit Sale Return: same editor and rules as Add; the customer stays the return's own customer. */
export function EditSaleReturnDrawer({ record, isOpen, onClose }: { record: SaleReturn | null; isOpen: boolean; onClose: () => void }) {
    return (
        <Drawer title={record ? `Update Sale Return ${record.returnNumber}` : "Update Sale Return"} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {record && (
                <div className="pb-32">
                    <EditSaleReturnBody key={record.id} record={record} onDone={onClose} />
                </div>
            )}
        </Drawer>
    );
}
