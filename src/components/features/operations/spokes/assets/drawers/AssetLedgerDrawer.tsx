"use client";
import { Drawer } from "@/components/ui/Drawer";
import { useMemo } from "react";
import { useAssetManager } from "@/hooks/asset_hooks/useAssetManager";
import { useGlobalAssetStore } from "@/store/useGlobalAssetStore";
import { Activity, User, Wrench, PackageCheck } from "lucide-react";

export function AssetLedgerDrawer({ manager }: { manager: ReturnType<typeof useAssetManager> }) {
    const store = useGlobalAssetStore();
    const isOpen = manager.drawerMode === "ledger";
    const asset = manager.activeAsset;

    // Filter logs specific to this asset
    const logs = useMemo(() => {
        if (!asset) return [];
        return store.ledgerLogs
            .filter(log => log.assetId === asset.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest first
    }, [asset, store.ledgerLogs]);

    const getActionIcon = (action: string) => {
        switch (action) {
            case "Assigned": return <User className="w-4 h-4 text-blue-600" />;
            case "Repaired": return <Wrench className="w-4 h-4 text-amber-600" />;
            case "Purchased": return <PackageCheck className="w-4 h-4 text-emerald-600" />;
            default: return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            width="w-full sm:w-[calc(100vw-260px)]"
            title={asset ? `Asset Lifecycle: ${asset.assetCode}` : "Asset Ledger"}
        >
            <div className="p-4 sm:p-6 flex flex-col h-full bg-gray-50/50">
                {asset && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs mb-6">
                        <h3 className="font-bold text-gray-900">{asset.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Serial: {asset.serialNumber} • Value: ৳{asset.currentDepreciatedValue.toLocaleString()}</p>
                    </div>
                )}

                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Historical Timeline</h4>

                <div className="flex-1 overflow-y-auto pr-2 relative border-l-2 border-gray-200 ml-3 space-y-6 pb-10">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-6">
                            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center z-10">
                                {getActionIcon(log.action)}
                            </div>
                            <div className="bg-white p-3.5 rounded-lg border border-gray-100 shadow-2xs ml-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-gray-900">{log.action}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                {log.employeeName && (
                                    <p className="text-[11px] text-gray-600 mt-1">
                                        Custodian: <strong className="text-gray-900">{log.employeeName}</strong>
                                    </p>
                                )}
                                {log.cost && (
                                    <p className="text-[11px] text-gray-600 mt-1">
                                        Financial Impact: <strong className="text-gray-900">৳{log.cost.toLocaleString()}</strong>
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">{log.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Drawer>
    );
}