"use client";
import * as React from "react";
import { CreateBarcodeForm } from "./CreateBarcodeForm";

export function CreateBarcodeClient() {
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Create barcode</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col p-6 gap-6">
                <CreateBarcodeForm />
            </div>
        </div>
    );
}