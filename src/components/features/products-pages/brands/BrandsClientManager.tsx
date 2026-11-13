"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { BrandInput } from "@/types/products";
import { BrandsTable } from "./BrandsTable";
import { BrandMasterForm } from "./BrandMasterForm";
import { BrandReorderList } from "./BrandReorderList";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function BrandsClientManager() {
    const manager = useProductsManager("brands");

    const isOpen = manager.drawerMode === "add" || manager.drawerMode === "edit" || manager.drawerMode === "reorder";
    // Keep the drawer content in place while it slides out.
    const drawerMode = useRetainedValue(manager.drawerMode, isOpen);
    const brand = useRetainedValue(manager.drawerMode === "edit" ? manager.activeRecord : null, isOpen);

    const getDrawerTitle = () => {
        switch (drawerMode) {
            case "add": return "Add Brand";
            case "edit": return "Update Brand";
            case "reorder": return "Reorder Brands";
            default: return "";
        }
    };

    const handleSubmit = (input: BrandInput) => {
        if (brand) {
            manager.store.updateBrand(brand.id, input);
            toast.success("Brand updated successfully.");
        } else {
            manager.store.addBrand(input);
            toast.success("Brand created successfully.");
        }
        manager.closeDrawer();
    };

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Brands</h1>
                            <p className="text-xs sm:text-sm text-brand-subtext">Manage manufacturer catalog, app links, and branding</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => manager.openDrawer("drawer", "reorder")}
                                className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                            >
                                Reorder Brands
                            </button>
                            <button
                                onClick={() => manager.openDrawer("drawer", "add")}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                            >
                                + Add Brand
                            </button>
                        </div>
                    </div>
                }
            >
                <BrandsTable manager={manager} />
            </SectionPageShell>

            <Drawer
                title={getDrawerTitle()}
                isOpen={isOpen}
                onClose={manager.closeDrawer}
                width="w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
            >
                {drawerMode === "add" || drawerMode === "edit" ? (
                    <BrandMasterForm
                        key={brand?.id || "new"}
                        brand={brand}
                        onCancel={manager.closeDrawer}
                        onSubmit={handleSubmit}
                    />
                ) : drawerMode === "reorder" ? (
                    <BrandReorderList onBack={manager.closeDrawer} />
                ) : null}
            </Drawer>
        </>
    );
}
