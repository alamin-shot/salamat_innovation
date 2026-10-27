"use client";
import { useState } from "react";
import { CourierManagerType } from "@/hooks/courier_hooks/useCourierManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const STORE_OPTIONS = ["TEKZO Online Shop", "TEKZO"];

export function SyncPathaoDrawer({ manager }: { manager: CourierManagerType }) {
    const [selectedStore, setSelectedStore] = useState<string>(STORE_OPTIONS[0]);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        // Simulate API call
        setTimeout(() => {
            manager.store.syncPathao(selectedStore);
            setIsSyncing(false);
            toast.success(`Successfully synced orders from ${selectedStore}`);
            manager.closeDrawer();
        }, 1500);
    };

    return (
        <Drawer
            title="Sync Orders from Pathao"
            isOpen={manager.activeDrawer === "sync-pathao"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-lg mx-auto w-full flex flex-col gap-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-3">
                        <RefreshCcw className="h-5 w-5 shrink-0 text-blue-600" />
                        <p>Syncing will pull the latest delivery statuses and new consignment IDs directly from the Pathao merchant API.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 min-h-[250px]">
                        <label className="erp-label">Store <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={selectedStore}
                            onChange={(val) => setSelectedStore(val as string)}
                            options={STORE_OPTIONS}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9" disabled={isSyncing}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSync} className="px-8 h-9 gap-2" disabled={isSyncing}>
                        <RefreshCcw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Sync"}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}