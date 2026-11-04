"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";

export function ReportFilterBar({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    return (
        <div className="erp-card bg-white p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-100 shadow-2xs w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full md:w-auto">
                {/* RESPONSIVE FIX: w-full on mobile, w-60 on sm+ */}
                <div className="flex flex-col gap-1.5 w-full sm:w-60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        PROGRAM / DEPARTMENT
                    </span>
                    <CustomSelect
                        value={manager.departmentFilter}
                        options={["Choose department", "Marketing", "Sales", "HR & Administration", "Procurement"]}
                        onChange={manager.setDepartmentFilter}
                    />
                </div>
                {/* RESPONSIVE FIX: w-full on mobile, w-64 on sm+ */}
                <div className="flex flex-col gap-1.5 w-full sm:w-64">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        SEARCH ATTENDEE
                    </span>
                    <input
                        type="text"
                        placeholder="Filter by employee name or ID..."
                        className="erp-input h-[38px] w-full"
                        value={manager.searchQuery}
                        onChange={(e) => manager.setSearchQuery(e.target.value)}
                    />
                </div>
                <span className="text-[11px] text-gray-500 pb-2">
                    Month/Year: <strong className="text-gray-800">{manager.monthName} {manager.year}</strong>
                </span>
            </div>

            {/* RESPONSIVE FIX: Text aligns left on mobile, right on desktop */}
            <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    DAILY ATTENDANCE RECORD
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    Click any cell (P, A, L, H, —) to inspect punch logs or override day status
                </p>
            </div>
        </div>
    );
}