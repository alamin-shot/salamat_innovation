"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { SpecGroupsTable } from "./SpecGroupsTable";
import { SpecGroupDrawer } from "./SpecGroupDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function SpecGroupsClientManager() {
    const manager = useProductsManager("specification_groups");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
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
                }
            >
                <SpecGroupsTable manager={manager} />
            </SectionPageShell>

            <SpecGroupDrawer manager={manager} />
        </>
    );
}
