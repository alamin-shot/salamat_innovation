"use client";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { MonitorPlay, Wrench, ShieldAlert, CircleDollarSign } from "lucide-react";

export function AssetAnalyticsRibbon({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    // These calculations would technically live in the hook for strict purity, but are placed here for rapid UI assembly visualization
    const totalValue = manager.paginatedAssets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const depreciatedValue = manager.paginatedAssets.reduce((sum, a) => sum + a.currentDepreciatedValue, 0);
    const inRepairCount = manager.paginatedAssets.filter(a => a.status === "Under Maintenance").length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-1">
            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-2xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Book Value</p>
                    <p className="text-lg font-black text-gray-900 font-mono leading-tight">৳ {depreciatedValue.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 font-medium">From ৳ {totalValue.toLocaleString()} Orig.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-2xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MonitorPlay className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Custody</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">
                        {manager.paginatedAssets.filter(a => a.status === "Assigned").length}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-2xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Maintenance</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">{inRepairCount}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-2xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Warranty Risk</p>
                    <p className="text-lg font-black text-gray-900 leading-tight">0</p>
                    <p className="text-[9px] text-gray-400 font-medium">Expiring in 30 Days</p>
                </div>
            </div>
        </div>
    );
}