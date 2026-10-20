"use client";
import { useDirectorManager } from "@/hooks/finance_hooks/withdrawal_hooks/useDirectorManager";
import { DirectorTable } from "./DirectorTable";
import { DirectorFormDrawer } from "./form-drawer/DirectorFormDrawer";

export function DirectorClient() {
    const manager = useDirectorManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Director</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <DirectorTable manager={manager} />
            </div>
            <DirectorFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-director"}
                onClose={manager.closeView}
            />
        </div>
    );
}