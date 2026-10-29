"use client";
import { useEliteManager } from "@/hooks/elite_hooks/useEliteManager";
import { EliteCard } from "./EliteCard";
import { EliteDrawer } from "./EliteDrawer";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function EliteClient() {
    const manager = useEliteManager();

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Elite Loyalty Tiers</h1>

                <Button variant="success" onClick={manager.openAddDrawer} className="h-9 px-4 gap-2">
                    <Plus className="h-4 w-4" /> Add Elite
                </Button>
            </div>

            <div className="flex-1 erp-card p-6 bg-white">
                {manager.tiers.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-500 font-medium bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                        No Elite Tiers found. Create one to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {manager.tiers.map(tier => (
                            <EliteCard
                                key={tier.id}
                                tier={tier}
                                onEdit={manager.openEditDrawer}
                                onDelete={manager.handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <EliteDrawer manager={manager} />
        </div>
    );
}