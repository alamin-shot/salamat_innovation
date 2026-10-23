"use client";
import { useFranchiseManager } from "@/hooks/partner_hooks/franchise_hooks/useFranchiseManager";
import { FranchiseTable } from "./FranchiseTable";
import { FranchiseFormDrawer } from "./form-drawer/FranchiseFormDrawer";

export function FranchiseClient() {
    const manager = useFranchiseManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Franchise List</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <FranchiseTable manager={manager} />
            </div>
            <FranchiseFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "franchise-form"}
                onClose={manager.closeView}
            />
        </div>
    );
}