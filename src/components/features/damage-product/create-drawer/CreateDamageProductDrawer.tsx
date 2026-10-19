"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useAddDamageProductManager } from "@/hooks/inventory_hooks/useAddDamageProductManager";
import { DamageTopSection } from "./DamageTopSection";
import { DamageQueueSection } from "./DamageQueueSection";

export function CreateDamageProductDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const manager = useAddDamageProductManager(onClose);

    if (!isOpen) return null;

    return (
        <Drawer title="Record Damage Product" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                    <DamageTopSection manager={manager} />
                    <DamageQueueSection manager={manager} onClose={onClose} />
                </div>
            </div>
        </Drawer>
    );
}