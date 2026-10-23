"use client";
import { useDealerManager } from "@/hooks/partner_hooks/dealer_hooks/useDealerManager";
import { DealerTable } from "./DealerTable";
import { DealerFormDrawer } from "./form-drawer/DealerFormDrawer";

export function DealerClient() {
    const manager = useDealerManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Dealer List</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <DealerTable manager={manager} />
            </div>
            <DealerFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "dealer-form"}
                onClose={manager.closeView}
            />
        </div>
    );
}