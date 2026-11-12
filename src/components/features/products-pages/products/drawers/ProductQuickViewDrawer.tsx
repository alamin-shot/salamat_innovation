"use client";
import * as React from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { ProductInput, ProductVariant, ProductVariantOption, ProductsQuickViewType } from "@/types/products";
import { SpecificationsForm } from "../SpecificationsForm";
import { WarrantyDetailsForm } from "./WarrantyDetailsForm";
import { ProductVariantsForm } from "./ProductVariantsForm";
import { ProductCareForm } from "./ProductCareForm";

interface ProductQuickViewDrawerProps {
    manager: ProductsManager<"products">;
}

const TITLES: Partial<Record<ProductsQuickViewType, string>> = {
    warranty: "Warranty Details",
    variants: "Product Variants",
    specs: "Specifications",
    care: "Care Instructions",
};

/** Sliding drawer for the in-table Warranty, Variants, Specs and Care views. */
export function ProductQuickViewDrawer({ manager }: ProductQuickViewDrawerProps) {
    const isOpen = manager.quickView !== null && manager.quickViewRecord !== null;
    const quickView = useRetainedValue(manager.quickView, isOpen);
    const product = useRetainedValue(manager.quickViewRecord, isOpen);

    const close = () => manager.setQuickView(null);

    const handleAdvancedEdit = () => {
        if (!product) return;
        manager.setQuickView(null);
        manager.openDrawer("drawer", "edit", product.id);
    };

    const handleSaveWarranty = (updates: Partial<ProductInput>) => {
        if (!product) return;
        manager.store.updateProduct(product.id, updates);
        toast.success("Warranty details updated.");
        close();
    };

    const handleSaveVariants = (options: ProductVariantOption[], variants: ProductVariant[]) => {
        if (!product) return;
        manager.store.saveProductVariants(product.id, options, variants);
        toast.success("Variants saved successfully.");
        close();
    };

    const handleSaveCare = (carePlanId: string | null) => {
        if (!product) return;
        manager.store.setProductCarePlan(product.id, carePlanId);
        toast.success(carePlanId ? "Care plan saved." : "Care plan removed.");
        close();
    };

    return (
        <Drawer
            title={quickView ? TITLES[quickView.type] ?? "" : ""}
            isOpen={isOpen}
            onClose={close}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {product && quickView && (
                <div className="flex flex-col gap-4">
                    <div className="flex w-full justify-end">
                        <button
                            onClick={handleAdvancedEdit}
                            className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
                            title="Open Full Drawer"
                        >
                            <span>Advanced</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {quickView.type === "warranty" && <WarrantyDetailsForm key={`warranty-${product.id}`} product={product} onSubmit={handleSaveWarranty} />}
                    {quickView.type === "variants" && <ProductVariantsForm key={`variants-${product.id}`} product={product} onSubmit={handleSaveVariants} />}
                    {quickView.type === "specs" && <SpecificationsForm key={`specs-${product.id}`} productId={product.id} />}
                    {quickView.type === "care" && <ProductCareForm key={`care-${product.id}`} product={product} onSubmit={handleSaveCare} />}
                </div>
            )}
        </Drawer>
    );
}
