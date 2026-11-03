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
        <div className="flex flex-col w-full h-full gap-5 p-4">

            <ReportHeader manager={manager} />
            <ReportFilterBar manager={manager} />

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
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