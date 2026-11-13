"use client";
import * as React from "react";
import { PrintQueueTable } from "./PrintQueueTable";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function PrintBarcodesClient() {
    return (
        <SectionPageShell
            cardClassName="flex flex-col p-6 gap-2"
            header={
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Print Barcode</h1>
                </div>
            }
        >
            <PrintQueueTable />
        </SectionPageShell>
    );
}