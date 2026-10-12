"use client";
import * as React from "react";
import { useCommandParams } from "@/hooks/useCommandParams";
import { Drawer } from "@/components/ui/Drawer";
import { BrandsTable } from "./BrandsTable";
import { BrandMasterForm } from "./BrandMasterForm";
import { BrandReorderList } from "./BrandReorderList";

export function BrandsClientManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    const getDrawerTitle = () => {
        switch (activeDrawer) {
            case "add": return "Add Brand";
            case "edit": return "Update Brand";
            case "reorder": return "Reorder Brands";
            default: return "";
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Brands</h1>
                        <p className="text-xs sm:text-sm text-brand-subtext">Manage manufacturer catalog, app links, and branding</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => openView("drawer", "reorder")}
                            className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                        >
                            Reorder Brands
                        </button>
                        <button
                            onClick={() => openView("drawer", "add")}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                        >
                            + Add Brand
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1">
                    <BrandsTable />
                </div>
            </div>

            <Drawer
                title={getDrawerTitle()}
                isOpen={!!activeDrawer}
                onClose={closeView}
                width="w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
            >
                {activeDrawer === "add" || activeDrawer === "edit" ? (
                    <BrandMasterForm brandId={activeId} onCancel={closeView} onSave={closeView} />
                ) : activeDrawer === "reorder" ? (
                    <BrandReorderList onBack={closeView} />
                ) : null}
            </Drawer>
        </>
    );
}