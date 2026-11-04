"use client";
import { useLeaveRequestManager } from "@/hooks/leaves_hooks/useLeaveRequestManager";
import { LeaveRequestHeader } from "./LeaveRequestHeader";
import { LeaveRequestFilterBar } from "./LeaveRequestFilterBar";
import { LeaveRequestTable } from "./LeaveRequestTable";
import { LeaveRequestDrawer } from "../drawers/LeaveRequestDrawer";
import { LeaveRequestViewDrawer } from "../drawers/LeaveRequestViewDrawer";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Button } from "@/components/ui/Button";

export function LeaveRequestClient() {
    const manager = useLeaveRequestManager();

    const toggleSelectAll = (checked: boolean) => {
        if (checked) manager.setSelectedIds(manager.requests.map((r) => r.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <LeaveRequestHeader onAddClick={manager.openAddDrawer} />

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <LeaveRequestFilterBar
                    searchQuery={manager.searchQuery}
                    setSearchQuery={manager.setSearchQuery}
                    statusFilter={manager.statusFilter}
                    setStatusFilter={manager.setStatusFilter}
                    typeFilter={manager.typeFilter}
                    setTypeFilter={manager.setTypeFilter}
                    leaveTypes={manager.leaveTypes}
                />

                <LeaveRequestTable
                    requests={manager.requests}
                    selectedIds={manager.selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onReview={manager.handleReview}
                    onView={manager.openViewDrawer}
                    onEdit={manager.openEditDrawer}
                    onDelete={manager.handleDelete}
                    table={manager.table}
                />
            </div>

            {/* Bulk Action Bar */}
            {manager.selectedIds.length > 0 && (
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="default" size="sm" onClick={() => manager.handleBulkReview("Approved")}>
                        Bulk Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => manager.handleBulkReview("Rejected")}>
                        Bulk Reject
                    </Button>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            {/* Drawers */}
            <LeaveRequestDrawer
                isOpen={manager.drawerMode !== "none"}
                mode={manager.drawerMode === "edit" ? "edit" : "add"}
                activeRequest={manager.getActiveRequest()}
                employees={manager.employees}
                leaveTypes={manager.leaveTypes}
                onClose={manager.closeFormDrawer}
                onSave={manager.handleSave}
            />

            <LeaveRequestViewDrawer
                request={manager.getViewRequest()}
                onClose={manager.closeViewDrawer}
            />

        </div>
    );
}