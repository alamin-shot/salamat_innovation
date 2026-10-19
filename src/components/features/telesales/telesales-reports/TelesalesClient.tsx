"use client";
import { useTelesalesManager } from "@/hooks/useTelesalesManager";
import { TelesalesTable } from "./TelesalesTable";
import { ViewTelesaleDrawer } from "./view-drawer/ViewTelesaleDrawer";
import { TelesalesFormDrawer } from "./form-drawer/TelesalesFormDrawer";

export function TelesalesReportsClient() {
    const manager = useTelesalesManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Telesales</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <TelesalesTable manager={manager} />
            </div>

            <ViewTelesaleDrawer
                id={manager.retainedViewId}
                record={manager.activeViewRecord}
                isOpen={manager.activeDrawer === "view-telesale"}
                onClose={manager.closeView}
            />

            <TelesalesFormDrawer
                mode="create"
                isOpen={manager.activeDrawer === "create-telesale"}
                onClose={manager.closeView}
            />

            <TelesalesFormDrawer
                mode="edit"
                id={manager.retainedEditId}
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-telesale"}
                onClose={manager.closeView}
            />
        </div>
    );
}