"use client";
import * as React from "react";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useDamageProductsManager } from "@/hooks/inventory_hooks/useDamageProductsManager";
import { DamageProductTable } from "./DamageProductTable";
import { ViewDamageProductDrawer } from "./view-drawer/ViewDamageProductDrawer";
import { CreateDamageProductDrawer } from "./create-drawer/CreateDamageProductDrawer";

export function DamageProductClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();
    const manager = useDamageProductsManager();

    const [retainedViewId, setRetainedViewId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activeDrawer === "view-damage-product" && activeId) {
            setRetainedViewId(activeId);
        }
    }, [activeDrawer, activeId]);

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Damage Product</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <DamageProductTable manager={manager} />
            </div>

            <ViewDamageProductDrawer
                id={retainedViewId}
                isOpen={activeDrawer === "view-damage-product"}
                onClose={closeView}
                onStatusChange={manager.handleStatusChange}
            />

            <CreateDamageProductDrawer
                isOpen={activeDrawer === "create-damage-product"}
                onClose={closeView}
            />
        </div>
    );
}