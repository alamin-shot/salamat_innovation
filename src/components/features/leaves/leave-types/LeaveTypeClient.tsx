"use client";
import { useLeaveTypeManager } from "@/hooks/leaves_hooks/useLeaveTypeManager";
import { LeaveTypeHeader } from "./LeaveTypeHeader";
import { LeaveTypeTable } from "./LeaveTypeTable";
import { LeaveTypeDrawer } from "../drawers/LeaveTypeDrawer";


export function LeaveTypeClient() {
    const manager = useLeaveTypeManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <LeaveTypeHeader onAddClick={manager.openAddDrawer} />

            <LeaveTypeTable
                searchQuery={manager.searchQuery}
                setSearchQuery={manager.setSearchQuery}
                paginated={manager.logs}
                onEdit={manager.openEditDrawer}
                onDelete={manager.handleDelete}
                currentPage={manager.table.currentPage}
                totalPages={manager.table.totalPages}
                perPage={manager.table.perPage}
                onPageChange={manager.table.onPageChange}
                onPerPageChange={manager.table.onPerPageChange}
            />

            <LeaveTypeDrawer
                isOpen={manager.drawerMode !== "none"}
                mode={manager.drawerMode === "edit" ? "edit" : "add"}
                activeType={manager.getActiveType()}
                onClose={manager.closeDrawer}
                onSave={manager.handleSave}
            />

        </div>
    );
}