"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useSaleReturnManager } from "@/hooks/sales_hooks/useSaleReturnManager";
import { ReturnTopSection } from "./ReturnTopSection";
import { ReturnQueueSection } from "./ReturnQueueSection";
import { ReturnSummarySection } from "./ReturnSummarySection";

export function EditSaleReturnDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const manager = useSaleReturnManager();

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title={`Update Sale Return`}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                    <ReturnTopSection manager={manager} />
                    <ReturnQueueSection manager={manager} />
                    <ReturnSummarySection manager={manager} />

                    <div className="flex justify-end pt-4 mt-2">
                        <Button variant="success" onClick={manager.handleSave} className="px-8">
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}