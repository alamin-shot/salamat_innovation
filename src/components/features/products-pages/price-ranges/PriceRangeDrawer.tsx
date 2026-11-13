import * as React from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { PriceRangeAnalysis } from "@/hooks/products_hooks/usePriceRangeAnalysis";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { PriceRangeInput } from "@/types/products";
import { PriceRangeForm } from "./PriceRangeForm";

interface PriceRangeDrawerProps {
    manager: ProductsManager<"price_ranges">;
    analysis: PriceRangeAnalysis;
}

export function PriceRangeDrawer({ manager, analysis }: PriceRangeDrawerProps) {
    const isOpen = manager.drawerMode === "add" || manager.drawerMode === "edit";
    const isEditMode = useRetainedValue(manager.drawerMode === "edit", isOpen);
    const record = useRetainedValue(manager.drawerMode === "edit" ? manager.activeRecord : null, isOpen);

    const handleSubmit = (input: PriceRangeInput) => {
        if (record) {
            manager.store.updatePriceRange(record.id, input);
            toast.success("Price range updated.");
        } else {
            manager.store.addPriceRange(input);
            toast.success("Price range created.");
        }
        manager.closeDrawer();
    };

    return (
        <Drawer
            title={isEditMode ? "Update Price Range" : "Add Price Range"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <PriceRangeForm
                key={record?.id || "new"}
                record={record}
                ranges={analysis.ranges}
                onSubmit={handleSubmit}
                onCancel={manager.closeDrawer}
            />
        </Drawer>
    );
}
