"use client";
import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { SpecGroupInput } from "@/types/products";
import { SpecGroupForm } from "./SpecGroupForm";

interface SpecGroupDrawerProps {
    manager: ProductsManager<"specification_groups">;
}

export function SpecGroupDrawer({ manager }: SpecGroupDrawerProps) {
    const isOpen = manager.drawerMode === "add" || manager.drawerMode === "edit";
    const isEditMode = useRetainedValue(manager.drawerMode === "edit", isOpen);
    const group = useRetainedValue(manager.drawerMode === "edit" ? manager.activeRecord : null, isOpen);

    const handleSubmit = (input: SpecGroupInput) => {
        if (group) {
            manager.store.updateSpecGroup(group.id, input);
            toast.success("Specification group updated.");
        } else {
            manager.store.addSpecGroup(input);
            toast.success("Specification group created.");
        }
        manager.closeDrawer();
    };

    return (
        <Drawer
            title={isEditMode ? "Update Specification Groups" : "Add Specification Groups"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <SpecGroupForm
                key={group?.id || "new"}
                group={group}
                onSubmit={handleSubmit}
                onCancel={manager.closeDrawer}
            />
        </Drawer>
    );
}
