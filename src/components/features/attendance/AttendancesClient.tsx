"use client";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { AttendanceFormDrawer } from "./drawers/AttendanceFormDrawer";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";

import { AttendancesHeader } from "./attendances/AttendancesHeader";
import { AttendancesFilterBar } from "./attendances/AttendancesFilterBar";
import { AttendancesTable } from "./attendances/AttendancesTable";

export function AttendancesClient() {
    const manager = useAttendancesManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <AttendancesHeader manager={manager} />
            <AttendancesFilterBar manager={manager} />

            <AttendancesTable manager={manager} />

            {/* Floating Bulk Actions */}
            {manager.selectedIds.length > 0 && (
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="default" size="sm" onClick={() => manager.handleBulkAction("Approved")}>
                        Bulk Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => manager.handleBulkAction("Rejected")}>
                        Bulk Reject
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => manager.handleBulkAction("Delete")}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            {/* Right-Side Drawers */}
            <AttendanceFormDrawer manager={manager} />

            <PunchDetailsDrawer
                log={manager.getDetailsLog()}
                onClose={() => manager.setDetailsLogId(null)}
                onOpenLocation={(loc) => manager.setLocationDrawerData(loc)}
            />

            <PunchLocationDrawer
                locationData={manager.locationDrawerData}
                onClose={() => manager.setLocationDrawerData(null)}
            />
        </div>
    );
}