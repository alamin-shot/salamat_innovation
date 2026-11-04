"use client";
import { useState } from "react";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";
import { ReportHeader } from "./report/ReportHeader";
import { ReportFilterBar } from "./report/ReportFilterBar";
import { ReportMatrixTable } from "./report/ReportMatrixTable";
import { ReportPayrollTable } from "./report/ReportPayrollTable";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import { DayStatusOverrideDrawer } from "./drawers/DayStatusOverrideDrawer";

export function AttendanceReportClient() {
    const manager = useAttendanceReportManager();
    const [locationData, setLocationData] = useState<any | null>(null);

    return (
        // RESPONSIVE FIX: Changed gap-5 to gap-4, adjusted padding for mobile
        <div className="flex flex-col w-full h-full gap-4 p-3 sm:p-4">

            <ReportHeader manager={manager} />
            <ReportFilterBar manager={manager} />

            {/* RESPONSIVE FIX: Removed strict h-full and added min-h-[500px] so it never collapses to 0 height */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden min-h-[500px] shadow-sm">
                {manager.viewMode === "matrix" ? (
                    <ReportMatrixTable manager={manager} />
                ) : (
                    <ReportPayrollTable manager={manager} />
                )}
            </div>

            <PunchDetailsDrawer
                log={manager.getSelectedLog()}
                onClose={() => manager.setSelectedLogId(null)}
                onOpenLocation={setLocationData}
            />

            <PunchLocationDrawer
                locationData={locationData}
                onClose={() => setLocationData(null)}
            />

            <DayStatusOverrideDrawer manager={manager} />
        </div>
    );
}