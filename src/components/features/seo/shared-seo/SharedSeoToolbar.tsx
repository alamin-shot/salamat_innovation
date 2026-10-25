"use client";
import { SharedSeoManagerType } from "@/hooks/seo_hooks/useSharedSeoManager";
import { Button } from "@/components/ui/Button";
import { Search, Plus } from "lucide-react";

export function SharedSeoToolbar({ manager }: { manager: SharedSeoManagerType }) {
    const singularTabName = manager.currentTab.endsWith('s') ? manager.currentTab.slice(0, -1) : manager.currentTab;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={`Search ${manager.currentTab}...`}
                    value={manager.table.searchQuery}
                    onChange={(e) => manager.table.setSearchQuery(e.target.value)}
                    className="erp-input pl-9 w-full"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="success" onClick={() => manager.openView("drawer", "seo-form")} className="h-9 px-4 text-[13px] font-medium gap-2">
                    <Plus className="h-4 w-4" />
                    Add {singularTabName}
                </Button>
            </div>
        </div>
    );
}