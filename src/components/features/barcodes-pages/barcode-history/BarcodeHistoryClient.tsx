"use client";
import * as React from "react";
import { useBarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodeHistoryTable } from "./BarcodeHistoryTable";
import { BarcodeDetailsDrawer } from "../shared/BarcodeDetailsDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function BarcodeHistoryClient() {
    const manager = useBarcodesManager("history");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                cardClassName="flex flex-col"
                header={
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Barcode History</h1>
                        <p className="text-xs sm:text-sm text-brand-subtext">Audit log of all inbound and outbound transactions</p>
                    </div>
                }
            >
                <BarcodeHistoryTable manager={manager} />
            </SectionPageShell>

            <BarcodeDetailsDrawer manager={manager} />
        </>
    );
}
