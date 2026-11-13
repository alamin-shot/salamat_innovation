"use client";
import * as React from "react";
import { CreateBarcodeForm } from "./CreateBarcodeForm";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function CreateBarcodeClient() {
    return (
        <SectionPageShell
            cardClassName="flex flex-col p-6 gap-2"
            header={
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Create barcode</h1>
                </div>
            }
        >
            <CreateBarcodeForm />
        </SectionPageShell>
    );
}