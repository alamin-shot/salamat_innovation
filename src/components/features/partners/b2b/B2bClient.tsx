"use client";
import { useB2bManager } from "@/hooks/partner_hooks/b2b_hooks/useB2bManager";
import { B2bTable } from "./B2bTable";
import { B2bFormDrawer } from "./form-drawer/B2bFormDrawer";

export function B2bClient() {
    const manager = useB2bManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">B2B List</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <B2bTable manager={manager} />
            </div>
            <B2bFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "b2b-form"}
                onClose={manager.closeView}
            />
        </div>
    );
}