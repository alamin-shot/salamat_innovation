"use client";
import { CourierManagerType } from "@/hooks/courier_hooks/useCourierManager";
import { BaseCourierTable } from "./BaseCourierTable";
import { Search, Filter, LayoutIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Placeholders for Phase 3
import { SyncPathaoDrawer } from "../drawers/SyncPathaoDrawer";
import { ImportExcelDrawer } from "../drawers/ImportExcelDrawer";

export function BaseCourierView({ manager }: { manager: CourierManagerType }) {
    const { config, table, openDrawer } = manager;

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>

                {/* Dynamic Top Action Button (e.g., Sync Pathao or Import Excel) */}
                {config.topAction && (
                    <button
                        onClick={() => openDrawer(config.topAction!.drawerToOpen)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${config.topAction.colorClass}`}
                    >
                        {config.topAction.label}
                    </button>
                )}
            </div>

            <div className="flex-1 erp-card flex flex-col p-0 overflow-hidden">
                {/* Universal Toolbar */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by tracking, recipient, or phone..."
                            value={table.searchQuery}
                            onChange={(e) => table.setSearchQuery(e.target.value)}
                            className="erp-input pl-9 w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button variant="outline" className="h-9 px-3 gap-2 text-gray-600">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                        <Button variant="outline" className="h-9 px-3 gap-2 text-gray-600">
                            <LayoutIcon className="h-4 w-4" /> Columns
                        </Button>
                    </div>
                </div>

                {/* Dynamic Mapping Table */}
                <BaseCourierTable manager={manager} />
            </div>

            {/* Drawers (To be implemented in Phase 3) */}
            <SyncPathaoDrawer manager={manager} />
            <ImportExcelDrawer manager={manager} />
        </div>
    );
}