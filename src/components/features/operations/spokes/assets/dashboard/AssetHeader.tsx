"use client";
import { Button } from "@/components/ui/Button";
import { Plus, Printer } from "lucide-react";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";

export function AssetHeader({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Asset Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Track company assets, financial depreciation, warranties, and employee custody logs.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto">
                    <button
                        onClick={() => manager.setActiveTab("assets")}
                        className={`flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeTab === "assets" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Physical Assets ({manager.paginatedAssets.length})
                    </button>
                    <button
                        onClick={() => manager.setActiveTab("categories")}
                        className={`flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeTab === "categories" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Categories ({manager.categories.length})
                    </button>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto">
                    {manager.activeTab === "assets" && (
                        <Button variant="outline" size="sm" className="h-9 bg-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none">
                            <Printer className="w-3.5 h-3.5" /> Bulk Barcodes
                        </Button>
                    )}
                    <Button
                        variant="default"
                        onClick={() => manager.activeTab === "assets" ? manager.openAssetDrawer() : manager.setDrawerMode("add_category")}
                        className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4" />
                        {manager.activeTab === "assets" ? "Add Asset" : "Add Category"}
                    </Button>
                </div>
            </div>
        </div>
    );
}