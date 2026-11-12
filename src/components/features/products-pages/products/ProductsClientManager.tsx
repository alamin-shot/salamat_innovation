"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { ProductInput, ProductVariant, ProductVariantOption } from "@/types/products";
import { ProductTable } from "@/components/features/products-pages/products/ProductTable";
import { ProductMasterForm } from "@/components/features/products-pages/products/ProductMasterForm";
import { SpecificationsForm } from "@/components/features/products-pages/products/SpecificationsForm";
import { ProductPreviewContent } from "@/components/features/products-pages/products/ProductPreviewContent";
import { ProductVariantsForm } from "./drawers/ProductVariantsForm";
import { ProductCareForm } from "./drawers/ProductCareForm";
import { ProductQuickViewDrawer } from "./drawers/ProductQuickViewDrawer";

const URL_DRAWERS = ["add-product", "edit", "preview", "specs", "variants", "care"];

export function ProductsClientManager() {
    const manager = useProductsManager("products");

    const isOpen = URL_DRAWERS.includes(manager.drawerMode);
    // Keep the drawer content in place while it slides out.
    const drawerMode = useRetainedValue(manager.drawerMode, isOpen);
    const product = useRetainedValue(manager.drawerMode === "add-product" ? null : manager.activeRecord, isOpen);

    const getDrawerTitle = () => {
        switch (drawerMode) {
            case "add-product": return "Add New Product";
            case "edit": return "Edit Product";
            case "preview": return "Live Storefront Preview";
            case "specs": return "Product Specifications";
            case "variants": return "Manage Variants";
            case "care": return "Product Care Instructions";
            default: return "";
        }
    };

    const handleSubmit = (input: ProductInput) => {
        if (product) {
            manager.store.updateProduct(product.id, input);
            toast.success("Product updated successfully.");
        } else {
            manager.store.addProduct(input);
            toast.success("Product created successfully.");
        }
        manager.closeDrawer();
    };

    const handleSaveVariants = (options: ProductVariantOption[], variants: ProductVariant[]) => {
        if (!product) return;
        manager.store.saveProductVariants(product.id, options, variants);
        toast.success("Variants saved successfully.");
        manager.closeDrawer();
    };

    const handleSaveCare = (carePlanId: string | null) => {
        if (!product) return;
        manager.store.setProductCarePlan(product.id, carePlanId);
        toast.success(carePlanId ? "Care plan saved." : "Care plan removed.");
        manager.closeDrawer();
    };

    const renderDrawerContent = () => {
        switch (drawerMode) {
            case "add-product":
            case "edit":
                return (
                    <ProductMasterForm
                        key={product?.id || "new"}
                        product={product}
                        onCancel={manager.closeDrawer}
                        onSubmit={handleSubmit}
                    />
                );
            case "preview": return <ProductPreviewContent product={product} />;
            case "specs": return <SpecificationsForm key={product?.id || "new"} productId={product?.id ?? null} />;
            case "variants": return product ? <ProductVariantsForm key={product.id} product={product} onSubmit={handleSaveVariants} /> : null;
            case "care": return product ? <ProductCareForm key={product.id} product={product} onSubmit={handleSaveCare} /> : null;
            default: return null;
        }
    };

    return (
        <div className={`transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            <ProductTable manager={manager} />
            <Drawer
                title={getDrawerTitle()}
                isOpen={isOpen}
                onClose={manager.closeDrawer}
                // All product drawers fill the content area beside the sidebar.
                width="w-full max-w-none lg:w-[calc(100vw-280px)]"
            >
                {renderDrawerContent()}
            </Drawer>
            <ProductQuickViewDrawer manager={manager} />
        </div>
    );
}
