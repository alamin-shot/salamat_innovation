"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useStockTransferManager } from "@/hooks/inventory_hooks/useStockTransferManager";
import { TransferTopSection } from "./TransferTopSection";
import { TransferQueueSection } from "./TransferQueueSection";

export function CreateStockTransferDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const manager = useStockTransferManager();

    if (!isOpen) return null;

    return (
        <Drawer title="Create Stock Transfer" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                    <TransferTopSection manager={manager} />
                    <hr className="border-gray-100" />
                    <TransferQueueSection manager={manager} onClose={onClose} />
                </div>
            </div>
        </Drawer>
    );
}