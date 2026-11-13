"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { UsedProductInput } from "@/types/products";
import { UsedProductTable } from "@/components/features/products-pages/used-products/UsedProductTable";
import { UsedProductMasterForm } from "@/components/features/products-pages/used-products/UsedProductMasterForm";
import { UsedProductPreviewContent } from "./UsedProductPreviewContent";
import { UsedQuickViewDrawer } from "./drawers/UsedQuickViewDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function UsedProductsClientManager() {
    const manager = useProductsManager("used_products");

    const isOpen = manager.drawerMode === "add-used" || manager.drawerMode === "edit-used" || manager.drawerMode === "preview";
    // Keep the drawer content in place while it slides out.
    const drawerMode = useRetainedValue(manager.drawerMode, isOpen);
    const product = useRetainedValue(manager.drawerMode === "add-used" ? null : manager.activeRecord, isOpen);

    const getDrawerTitle = () => {
        switch (drawerMode) {
            case "add-used": return "Add Used Product";
            case "edit-used": return "Update Used Product";
            case "preview": return "Live Storefront Preview";
            default: return "";
        }
    };

    const handleSubmit = (input: UsedProductInput) => {
        if (product) {
            manager.store.updateUsedProduct(product.id, input);
            toast.success("Used product updated successfully.");
        } else {
            manager.store.addUsedProduct(input);
            toast.success("Used product created successfully.");
        }
        manager.closeDrawer();
    };

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Used Products</h1>
                            <p className="text-xs sm:text-sm text-brand-subtext">Manage pre-owned inventory, serial numbers, and pricing</p>
                        </div>
                        <button
                            onClick={() => manager.openDrawer("drawer", "add-used")}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                        >
                            + Add Used Product
                        </button>
                    </div>
                }
            >
                <UsedProductTable manager={manager} />
            </SectionPageShell>

            <Drawer
                title={getDrawerTitle()}
                isOpen={isOpen}
                onClose={manager.closeDrawer}
                width="w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
            >
                {drawerMode === "add-used" || drawerMode === "edit-used" ? (
                    <UsedProductMasterForm
                        key={product?.id || "new"}
                        product={product}
                        onCancel={manager.closeDrawer}
                        onSubmit={handleSubmit}
                    />
                ) : drawerMode === "preview" ? (
                    <UsedProductPreviewContent product={product} />
                ) : null}
            </Drawer>

            <UsedQuickViewDrawer manager={manager} />
        </>
    );
}
