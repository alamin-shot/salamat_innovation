"use client";
import * as React from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { UsedProductInput } from "@/types/products";
import { UsedPriceForm } from "./UsedPriceForm";
import { UsedCareForm } from "./UsedCareForm";

interface UsedQuickViewDrawerProps {
    manager: ProductsManager<"used_products">;
}

/** Sliding drawer for the in-table Price and Care quick views. */
export function UsedQuickViewDrawer({ manager }: UsedQuickViewDrawerProps) {
    const isOpen = manager.quickView !== null && manager.quickViewRecord !== null;
    const quickView = useRetainedValue(manager.quickView, isOpen);
    const product = useRetainedValue(manager.quickViewRecord, isOpen);

    const close = () => manager.setQuickView(null);

    const handleAdvancedEdit = () => {
        if (!product) return;
        manager.setQuickView(null);
        manager.openDrawer("drawer", "edit-used", product.id);
    };

    const handleSavePrice = (updates: Partial<UsedProductInput>) => {
        if (!product) return;
        manager.store.updateUsedProduct(product.id, updates);
        toast.success("Price updated successfully.");
        close();
    };

    const handleSaveCare = (updates: Partial<UsedProductInput>) => {
        if (!product) return;
        manager.store.updateUsedProduct(product.id, updates);
        toast.success("Pre-owned care plan updated successfully.");
        close();
    };

    return (
        <Drawer
            title={quickView?.type === "price" ? "Update Price" : "Pre-Owned Care"}
            isOpen={isOpen}
            onClose={close}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {product && quickView && (
                <div className="flex flex-col gap-4">
                    <div className="mx-auto flex w-full max-w-4xl justify-end">
                        <button
                            onClick={handleAdvancedEdit}
                            className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
                            title="Open Full Drawer"
                        >
                            <span>Advanced</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {quickView.type === "price" ? (
                        <UsedPriceForm key={`price-${product.id}`} product={product} onSubmit={handleSavePrice} />
                    ) : (
                        <UsedCareForm key={`care-${product.id}`} product={product} onSubmit={handleSaveCare} />
                    )}
                </div>
            )}
        </Drawer>
    );
}
