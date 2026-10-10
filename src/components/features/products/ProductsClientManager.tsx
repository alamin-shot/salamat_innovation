"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ProductTable } from "@/components/features/products/ProductTable";
import { ProductMasterForm } from "@/components/features/products/ProductMasterForm";
import { SpecificationsForm } from "@/components/features/products/SpecificationsForm";
import { CareForm } from "@/components/features/products/CareForm";
import { VariantsManager } from "@/components/features/products/VariantsManager";
import { ProductPreviewContent } from "@/components/features/products/ProductPreviewContent";
import { useCommandParams } from "@/hooks/useCommandParams";

export function ProductsClientManager() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    const getDrawerTitle = () => {
        switch (activeDrawer) {
            case "add-product": return "Add New Product";
            case "edit": return "Edit Product";
            case "preview": return "Live Storefront Preview";
            case "specs": return "Product Specifications";
            case "variants": return "Manage Variants";
            case "care": return "Product Care Instructions";
            default: return "";
        }
    };

    const renderDrawerContent = () => {
        switch (activeDrawer) {
            case "add-product":
            case "edit":
                return (
                    <ProductMasterForm
                        productId={activeId}
                        onCancel={closeView}
                        onSave={closeView}
                    />
                );
            case "preview": return <ProductPreviewContent productId={activeId} />;
            case "specs": return <SpecificationsForm productId={activeId} />;
            case "variants": return <VariantsManager productId={activeId} />;
            case "care": return <CareForm productId={activeId} />;
            default: return null;
        }
    };

    return (
        <>
            <ProductTable />

            <Drawer
                title={getDrawerTitle()}
                isOpen={!!activeDrawer}
                onClose={closeView}
                width={
                    activeDrawer === "add-product" || activeDrawer === "edit" || activeDrawer === "preview"
                        // Wide Drawers: Full width on mobile, fills remaining screen on desktop
                        ? "w-full max-w-none lg:w-[calc(100vw-280px)]"
                        // Standard Drawers (Specs, Variants, Care): Full width on mobile, strictly 600px on tablet/desktop
                        : "w-full max-w-none sm:max-w-[600px]"
                }
            >
                {renderDrawerContent()}
            </Drawer>
        </>
    );
}