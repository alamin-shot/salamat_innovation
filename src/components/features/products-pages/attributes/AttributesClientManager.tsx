"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { AttributesTable } from "./AttributesTable";
import { AttributeDrawer } from "./AttributeDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function AttributesClientManager() {
    const manager = useProductsManager("attributes");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
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
                }
            >
                <AttributesTable manager={manager} />
            </SectionPageShell>

            <AttributeDrawer manager={manager} />
        </>
    );
}
