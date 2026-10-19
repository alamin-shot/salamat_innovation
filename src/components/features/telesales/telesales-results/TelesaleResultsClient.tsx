"use client";
import { useTelesaleResultsManager } from "@/hooks/telesales_hooks/useTelesaleResultsManager";
import { TelesaleResultsTable } from "./TelesaleResultsTable";
import { ViewTelesaleResultDrawer } from "./view-drawer/ViewTelesaleResultDrawer";
import { TelesaleResultFormDrawer } from "./form-drawer/TelesaleResultFormDrawer";

export function TelesaleResultsClient() {
    const manager = useTelesaleResultsManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Telesale Results</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <TelesaleResultsTable manager={manager} />
            </div>

            <ViewTelesaleResultDrawer
                id={manager.retainedViewId}
                record={manager.activeViewRecord}
                isOpen={manager.activeDrawer === "view-telesale-result"}
                onClose={manager.closeView}
            />

            <TelesaleResultFormDrawer
                mode="create"
                isOpen={manager.activeDrawer === "create-telesale-result"}
                onClose={manager.closeView}
            />

            <TelesaleResultFormDrawer
                mode="edit"
                id={manager.retainedEditId}
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-telesale-result"}
                onClose={manager.closeView}
            />
        </div>
    );
}