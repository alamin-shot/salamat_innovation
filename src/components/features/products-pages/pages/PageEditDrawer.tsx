"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { ProductPageInput } from "@/types/products";
import { PageEditForm } from "./PageEditForm";

interface PageEditDrawerProps {
    manager: ProductsManager<"pages">;
}

export function PageEditDrawer({ manager }: PageEditDrawerProps) {
    const isOpen = manager.drawerMode === "edit" && manager.activeRecord !== null;
    const page = useRetainedValue(manager.activeRecord, isOpen);

    const handleSubmit = (updates: Partial<ProductPageInput>) => {
        if (!page) {
            return;
        }
        manager.store.updatePage(page.id, updates);
        toast.success("Page branding updated successfully.");
        manager.closeDrawer();
    };

    return (
        <Drawer
            title="update_pages"
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {page && (
                <PageEditForm
                    key={page.id}
                    page={page}
                    onSubmit={handleSubmit}
                    onCancel={manager.closeDrawer}
                />
            )}
        </Drawer>
    );
}
