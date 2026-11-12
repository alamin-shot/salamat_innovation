"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { AttributesTable } from "./AttributesTable";
import { AttributeDrawer } from "./AttributeDrawer";

export function AttributesClientManager() {
    const manager = useProductsManager("attributes");

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Attributes</h1>
                    <p className="text-xs sm:text-sm text-brand-subtext">Manage global product variant attributes and property values</p>
                </div>

                <button
                    type="button"
                    onClick={() => manager.openDrawer("modal", "add")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                >
                    + Add Attribute
                </button>
            </div>

            <div className={`rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <AttributesTable manager={manager} />
            </div>

            <AttributeDrawer manager={manager} />
        </div>
    );
}
