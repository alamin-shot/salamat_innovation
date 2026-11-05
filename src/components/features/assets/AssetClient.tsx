"use client";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { AssetHeader } from "./dashboard/AssetHeader";
import { AssetAnalyticsRibbon } from "./dashboard/AssetAnalyticsRibbon";
import { AssetFilterBar } from "./dashboard/AssetFilterBar";
import { AssetLedgerTable } from "./tables/AssetLedgerTable";

import { AssetDrawer } from "./drawers/AssetDrawer";
import { AssetLedgerDrawer } from "./drawers/AssetLedgerDrawer";
import { ExpenseCategoryFormDrawer } from "../expenses/expense-categories/form-drawer/ExpenseCategoryFormDrawer";
import { AssetCategoryTable } from "./tables/AssetCategoryTable";
import { AssetCategoryDrawer } from "./drawers/AssetCategoryDrawer";

export function AssetClient() {
    const manager = useAssetManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-3 sm:p-4">
            <AssetHeader manager={manager} />
            <AssetAnalyticsRibbon manager={manager} />

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm w-full">
                <AssetFilterBar manager={manager} />

                {manager.activeTab === "assets" ? (
                    <AssetLedgerTable manager={manager} />
                ) : (
                    <AssetCategoryTable manager={manager} />
                )}
            </div>

            <AssetDrawer manager={manager} />
            <AssetLedgerDrawer manager={manager} />
            <AssetCategoryDrawer manager={manager} />
        </div>
    );
}