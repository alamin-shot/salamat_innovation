"use client";
import * as React from "react";
import { useBarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodeListTable } from "./BarcodeListTable";
import { BarcodeDetailsDrawer } from "../shared/BarcodeDetailsDrawer";
import { BarcodeEditDrawer } from "../shared/BarcodeEditDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function BarcodeListClient() {
    const manager = useBarcodesManager("list");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                cardClassName="flex flex-col"
                header={
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Barcode List</h1>
                    </div>
                }
            >
                <BarcodeListTable manager={manager} />
            </SectionPageShell>

            <BarcodeDetailsDrawer manager={manager} />
            <BarcodeEditDrawer manager={manager} />
        </>
    );
}
