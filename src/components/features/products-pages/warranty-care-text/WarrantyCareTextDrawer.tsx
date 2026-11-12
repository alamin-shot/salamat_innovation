"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useWarrantyCareTextUsage } from "@/hooks/products_hooks/useProductCatalogOptions";
import { WarrantyCareTextInput } from "@/types/products";
import { WarrantyCareTextForm } from "./WarrantyCareTextForm";

interface WarrantyCareTextDrawerProps {
    manager: ProductsManager<"warranty_care_text">;
}

export function WarrantyCareTextDrawer({ manager }: WarrantyCareTextDrawerProps) {
    const usage = useWarrantyCareTextUsage();
    const isOpen = manager.drawerMode === "add" || manager.drawerMode === "edit";
    const isEditMode = useRetainedValue(manager.drawerMode === "edit", isOpen);
    const record = useRetainedValue(manager.drawerMode === "edit" ? manager.activeRecord : null, isOpen);

    const handleSubmit = (input: WarrantyCareTextInput) => {
        if (record) {
            manager.store.updateWarrantyCareText(record.id, input);
            toast.success("Warranty care text updated.");
        } else {
            manager.store.addWarrantyCareText(input);
            toast.success("Warranty care text created.");
        }
        manager.closeDrawer();
    };

    return (
        <Drawer
            title={isEditMode ? "Update Warranty Care Text" : "Add Warranty Care Text"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <WarrantyCareTextForm
                key={record?.id || "new"}
                record={record}
                usageCount={record ? usage[record.id] ?? 0 : 0}
                onSubmit={handleSubmit}
                onCancel={manager.closeDrawer}
            />
        </Drawer>
    );
}
