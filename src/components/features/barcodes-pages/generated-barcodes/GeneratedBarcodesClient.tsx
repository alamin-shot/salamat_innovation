"use client";
import * as React from "react";
import { useBarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { GeneratedBarcodesTable } from "./GeneratedBarcodesTable";
import { BarcodeDetailsDrawer } from "../shared/BarcodeDetailsDrawer";
import { BarcodeEditDrawer } from "../shared/BarcodeEditDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function GeneratedBarcodesClient() {
    const manager = useBarcodesManager("generated");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                cardClassName="flex flex-col"
                header={
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Generated Barcodes</h1>
                    </div>
                }
            >
                <GeneratedBarcodesTable manager={manager} />
            </SectionPageShell>

            <BarcodeDetailsDrawer manager={manager} />
            <BarcodeEditDrawer manager={manager} />
        </>
    );
}
