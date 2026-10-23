"use client";
import { useApplicationManager } from "@/hooks/partner_hooks/application_hooks/useApplicationManager";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationFormDrawer } from "./form-drawer/ApplicationFormDrawer";

export function ApplicationClient() {
    const manager = useApplicationManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Applications</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <ApplicationTable manager={manager} />
            </div>
            <ApplicationFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "application-form"}
                onClose={manager.closeView}
            />
        </div>
    );
}