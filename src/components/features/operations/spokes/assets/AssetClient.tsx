"use client";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { AssetHeader } from "./dashboard/AssetHeader";
import { AssetAnalyticsRibbon } from "./dashboard/AssetAnalyticsRibbon";
import { AssetFilterBar } from "./dashboard/AssetFilterBar";
import { AssetLedgerTable } from "./tables/AssetLedgerTable";
import { AssetDrawer } from "./drawers/AssetDrawer";
import { AssetLedgerDrawer } from "./drawers/AssetLedgerDrawer";
import { AssetCategoryTable } from "./tables/AssetCategoryTable";
import { AssetCategoryDrawer } from "./drawers/AssetCategoryDrawer";

/** Assets spoke of the Operations hub. Flows with the page (no screen-height lock); the hub shell scrolls. */
export function AssetClient() {
    const manager = useAssetManager();

    return (
        <div className="flex flex-col w-full gap-2">
            <AssetHeader manager={manager} />
            <AssetAnalyticsRibbon manager={manager} />

            <div className="erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm w-full">
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
