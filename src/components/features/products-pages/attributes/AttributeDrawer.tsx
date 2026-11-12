"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { ProductAttributeInput } from "@/types/products";
import { AttributeForm } from "./AttributeForm";

interface AttributeDrawerProps {
    manager: ProductsManager<"attributes">;
}

export function AttributeDrawer({ manager }: AttributeDrawerProps) {
    const isOpen = manager.drawerMode === "add" || manager.drawerMode === "edit";
    const isEditMode = useRetainedValue(manager.drawerMode === "edit", isOpen);
    const attribute = useRetainedValue(manager.drawerMode === "edit" ? manager.activeRecord : null, isOpen);

    const handleSubmit = (input: ProductAttributeInput) => {
        if (attribute) {
            manager.store.updateAttribute(attribute.id, input);
            toast.success("Attribute updated successfully.");
        } else {
            manager.store.addAttribute(input);
            toast.success("Attribute created successfully.");
        }
        manager.closeDrawer();
    };

    return (
        <Drawer
            title={isEditMode ? "Update Attribute" : "Add Attribute"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <AttributeForm
                key={attribute?.id || "new"}
                attribute={attribute}
                onSubmit={handleSubmit}
                onCancel={manager.closeDrawer}
            />
        </Drawer>
    );
}
