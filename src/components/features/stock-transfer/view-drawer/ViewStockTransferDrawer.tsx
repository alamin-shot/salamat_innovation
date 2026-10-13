"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { TransferViewHeader } from "./TransferViewHeader";
import { TransferInfoGrid } from "./TransferInfoGrid";
import { TransferSerialsTable } from "./TransferSerialsTable";

export function ViewStockTransferDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const data = {
        ref: `ST-000${id || "353"}`,
        status: "Approved",
        fromShop: "TEKZO JFP 4A-018A",
        toShop: "A-Block",
        date: "2026-10-08",
        createdBy: "Md Zihadul Islam Sazzad",
        approvedBy: "Md Zihadul Islam Sazzad",
        serials: [
            { id: "1", serialNo: "0000027808", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" },
            { id: "2", serialNo: "0000027697", product: "VOLTME Revo 30 Mini2", sku: "V2259", variant: "White" }
        ]
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer title="Stock Transfer Detail" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7">
                    <TransferViewHeader refNo={data.ref} status={data.status} />
                    <div className="mt-5">
                        <TransferInfoGrid data={data} />
                    </div>
                    <TransferSerialsTable serials={data.serials} />
                </div>
            </div>
        </Drawer>
    );
}