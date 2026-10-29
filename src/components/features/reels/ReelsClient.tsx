"use client";
import { useReelsManager } from "@/hooks/reels_hooks/useReelsManager";
import { ReelsTable } from "./ReelsTable";
import { ReelsDrawer } from "./ReelsDrawer";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Button } from "@/components/ui/Button";
import { Search, Plus, Columns } from "lucide-react";

export function ReelsClient() {
    const manager = useReelsManager();
    const { table, openAddDrawer, handleBulkDelete } = manager;

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Reels Video</h1>
            </div>

            <div className="flex-1 erp-card flex flex-col p-0 overflow-hidden relative">

                {/* Toolbar */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product..."
                            value={table.searchQuery}
                            onChange={(e) => table.setSearchQuery(e.target.value)}
                            className="erp-input pl-9 w-full"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Button variant="outline" className="h-9 px-3 gap-2 text-gray-600">
                            <Columns className="h-4 w-4" /> Columns
                        </Button>
                        <Button variant="success" onClick={openAddDrawer} className="h-9 px-4 gap-2">
                            <Plus className="h-4 w-4" /> Add Reels Video
                        </Button>
                    </div>
                </div>

                <ReelsTable manager={manager} />

                {/* Bulk Actions Wrapper */}
                {table.selectedIds.length > 0 && (
                    <BulkActionBar
                        selectedCount={table.selectedIds.length}
                        onClearSelection={() => table.setSelectedIds([])}
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDelete}
                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                        >
                            Delete Selected
                        </Button>
                    </BulkActionBar>
                )}
            </div>

            <ReelsDrawer manager={manager} />
        </div>
    );
}