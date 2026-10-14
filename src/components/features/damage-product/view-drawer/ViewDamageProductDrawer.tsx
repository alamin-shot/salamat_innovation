"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { DamageViewHeader } from "./DamageViewHeader";
import { DamageInfoGrid } from "./DamageInfoGrid";
import { DamageSerialsTable } from "./DamageSerialsTable";

interface ViewDamageProductDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: (id: string, status: "Approved" | "Cancelled") => void;
}

export function ViewDamageProductDrawer({ id, isOpen, onClose, onStatusChange }: ViewDamageProductDrawerProps) {
    const data = {
        id: id || "2",
        ref: `DMG-00000${id || "2"}`,
        status: "Draft",
        shop: "A-Block",
        date: "2026-10-13",
        createdBy: "Md Zihadul Islam Sazzad",
        serials: [
            { id: "1", serialNo: "4516192621", product: "QCY Type C-L 27W Charging Cable", sku: "SI-588128987", variant: "Black", status: "Available" },
            { id: "2", serialNo: "7627187010", product: "QCY Type C-L 27W Charging Cable", sku: "SI-588128987", variant: "Black", status: "Available" },
        ],
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer title="Damage Product Detail" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7">
                    <DamageViewHeader
                        id={data.id}
                        refNo={data.ref}
                        status={data.status}
                        onStatusChange={onStatusChange}
                    />
                    <div className="mt-5">
                        <DamageInfoGrid data={data} />
                    </div>
                    <DamageSerialsTable serials={data.serials} />
                </div>
            </div>
        </Drawer>
    );
}