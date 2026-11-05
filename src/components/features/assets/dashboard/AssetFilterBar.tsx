"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";

export function AssetFilterBar({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    return (
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search by name, code, or serial..."
                    className="erp-input w-full sm:w-72 bg-white"
                    value={manager.searchQuery}
                    onChange={(e) => manager.setSearchQuery(e.target.value)}
                />

                {manager.activeTab === "assets" && (
                    <div className="w-full sm:w-44">
                        <CustomSelect
                            value={manager.statusFilter}
                            options={["All", "Available", "Assigned", "Under Maintenance", "Retired"]}
                            onChange={manager.setStatusFilter}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}