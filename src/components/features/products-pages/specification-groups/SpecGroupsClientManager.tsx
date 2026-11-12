"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { SpecGroupsTable } from "./SpecGroupsTable";
import { SpecGroupDrawer } from "./SpecGroupDrawer";

export function SpecGroupsClientManager() {
    const manager = useProductsManager("specification_groups");

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Specification Group List</h1>
                    <p className="text-xs sm:text-sm text-brand-subtext">Manage core specification categories and their sub-values</p>
                </div>

                <button
                    type="button"
                    onClick={() => manager.openDrawer("modal", "add")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                >
                    Add Specification Groups
                </button>
            </div>

            <div className={`rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <SpecGroupsTable manager={manager} />
            </div>

            <SpecGroupDrawer manager={manager} />
        </div>
    );
}
