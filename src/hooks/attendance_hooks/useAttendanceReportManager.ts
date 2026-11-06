"use client";
import { useState, useMemo, useCallback } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import {
    ReportEmployeeSummary,
    ReportCellData,
    MatrixCellCode,
    AttendanceBehavior
} from "@/types/attendance.types";
import { toast } from "sonner";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_FULL: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday"
};

export function useAttendanceReportManager() {
    const store = useGlobalAttendanceStore();

    const [monthIndex, setMonthIndex] = useState(10); // November (0-indexed)
    const [year, setYear] = useState("2026");
    const [departmentFilter, setDepartmentFilter] = useState("Choose department");
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightFilter, setHighlightFilter] = useState<"ALL" | "P" | "A" | "LV" | "H" | "LATE">("ALL");
    const [viewMode, setViewMode] = useState<"matrix" | "analytics">("matrix");

    const [density, setDensity] = useState<"compact" | "detailed">("compact");

    // Drawers State
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [overrideCellTarget, setOverrideCellTarget] = useState<{
        employeeId: string;
        employeeName: string;
        empCode: string;
        dayNum: number;
        isoDate: string;
        displayDate: string;
        currentCell: ReportCellData;
    } | null>(null);

    const daysInMonth = useMemo(() => {
        const y = Number(year);
        const count = new Date(y, monthIndex + 1, 0).getDate();
        return Array.from({ length: count }, (_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(y, monthIndex, dayNum);
            const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            return { dayNum, weekday, fullWeekday: WEEKDAY_FULL[weekday] || weekday };
        });
    }, [monthIndex, year]);

    const reportRows: ReportEmployeeSummary[] = useMemo(() => {
        const filteredEmps = store.employees.filter((emp) => {
            const matchesDept =
                departmentFilter === "Choose department" || emp.department === departmentFilter;
            const matchesSearch =
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.empCode.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDept && matchesSearch;
        });

        return filteredEmps.map((emp) => {
            const assignedShiftName = store.employeeShiftMap[emp.id] || "Showroom";
            const shiftObj =
                store.workShifts.find((ws) => ws.name === assignedShiftName) || store.workShifts[0];
            const shiftWeekends = shiftObj?.weekends || ["Wednesday"];

            const dailyStatuses: Record<number, ReportCellData> = {};
            let presentCount = 0;
            let absentCount = 0;
            let lateCount = 0;
            let earlyCount = 0;
            let leaveCount = 0;
            let holidayCount = 0;
            let weeklyOffCount = 0;

            daysInMonth.forEach(({ dayNum, fullWeekday }) => {
                const isoTarget = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const overrideKey = `${emp.id}_${isoTarget}`;
                const manualOverride = store.dayOverrides[overrideKey];
                const matchedLog = store.globalLogs.find(
                    (l) => l.employeeId === emp.id && l.isoDate === isoTarget
                );

                if (manualOverride && manualOverride.code !== "P") {
                    dailyStatuses[dayNum] = {
                        code: manualOverride.code,
                        leaveTitle: manualOverride.leaveType,
                        note: manualOverride.note
                    };
                    if (manualOverride.code === "A") absentCount++;
                    else if (manualOverride.code === "LV") leaveCount++;
                    else if (manualOverride.code === "H") holidayCount++;
                    else if (manualOverride.code === "-") weeklyOffCount++;
                } else if (matchedLog) {
                    const isLate = matchedLog.behavior === "late";
                    dailyStatuses[dayNum] = {
                        code: "P",
                        isLate,
                        logId: matchedLog.id,
                        punchIn: matchedLog.punchIn,
                        punchOut: matchedLog.punchOut,
                        totalHours: matchedLog.totalHours,
                        note: matchedLog.auditReason
                    };
                    presentCount++;
                    if (isLate) lateCount++;
                    if (matchedLog.behavior === "early") earlyCount++;
                } else if (
                    monthIndex === 10 &&
                    year === "2026" &&
                    dayNum === 1 &&
                    ["3346", "3347", "3358", "3360", "3363", "3369", "3373", "3376", "3378"].includes(emp.id)
                ) {
                    const isLateSeed = ["3373", "3378"].includes(emp.id);
                    dailyStatuses[dayNum] = {
                        code: "P",
                        isLate: isLateSeed,
                        punchIn: isLateSeed ? "11:18 AM" : "10:02 AM",
                        punchOut: "08:00 PM",
                        totalHours: "09:00:00"
                    };
                    presentCount++;
                    if (isLateSeed) lateCount++;
                } else if (shiftWeekends.includes(fullWeekday)) {
                    dailyStatuses[dayNum] = { code: "-" };
                    weeklyOffCount++;
                } else {
                    dailyStatuses[dayNum] = { code: "A" };
                    absentCount++;
                }
            });

            const totalCalendarDays = daysInMonth.length;
            const workingDaysTarget = totalCalendarDays - weeklyOffCount - holidayCount;
            const latePenaltyDays = Math.floor(lateCount / 3);
            const lopDays = absentCount + latePenaltyDays;
            const payableDays = Math.max(
                0,
                presentCount + leaveCount + holidayCount + weeklyOffCount - latePenaltyDays
            );

            return {
                employeeId: emp.id,
                employeeName: emp.name,
                empCode: emp.empCode,
                department: emp.department,
                outlet: emp.outlet,
                shiftName: assignedShiftName,
                dailyStatuses,
                totalCalendarDays,
                workingDaysTarget,
                presentCount,
                absentCount,
                lateCount,
                earlyCount,
                leaveCount,
                holidayCount,
                weeklyOffCount,
                latePenaltyDays,
                lopDays,
                totalWorkedHours: `${presentCount * 9}:00:00`,
                overtimeHours: emp.id === "3346" ? "01:08:38" : "00:00:00",
                payableDays
            };
        });
    }, [
        store.employees,
        store.globalLogs,
        store.employeeShiftMap,
        store.workShifts,
        store.dayOverrides,
        departmentFilter,
        searchQuery,
        daysInMonth,
        monthIndex,
        year
    ]);

    const columnTotals = useMemo(() => {
        const totals: Record<number, number> = {};
        daysInMonth.forEach(({ dayNum }) => {
            totals[dayNum] = reportRows.reduce(
                (acc, row) => acc + (row.dailyStatuses[dayNum]?.code === "P" ? 1 : 0),
                0
            );
        });
        return totals;
    }, [daysInMonth, reportRows]);

    const footerStats = useMemo(() => {
        return reportRows.reduce(
            (acc, r) => {
                acc.present += r.presentCount;
                acc.absent += r.absentCount;
                acc.leave += r.leaveCount;
                acc.holiday += r.holidayCount;
                acc.late += r.lateCount;
                return acc;
            },
            { present: 0, absent: 0, leave: 0, holiday: 0, late: 0, employees: reportRows.length }
        );
    }, [reportRows]);

    const handleCellClick = (row: ReportEmployeeSummary, dayNum: number) => {
        const cell = row.dailyStatuses[dayNum];
        if (cell?.code === "P" && cell.logId) {
            setSelectedLogId(cell.logId);
            return;
        }
        const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
        const displayDate = `${String(dayNum).padStart(2, "0")} ${MONTHS[monthIndex].slice(0, 3)} ${year}`;
        setOverrideCellTarget({
            employeeId: row.employeeId,
            employeeName: row.employeeName,
            empCode: row.empCode,
            dayNum,
            isoDate,
            displayDate,
            currentCell: cell || { code: "A" }
        });
    };

    const handleSaveCellOverride = (payload: {
        code: MatrixCellCode;
        punchIn?: string;
        punchOut?: string;
        behavior?: AttendanceBehavior;
        leaveType?: string;
        note: string;
    }) => {
        if (!overrideCellTarget) return;
        store.setDayStatusOverride({
            employeeId: overrideCellTarget.employeeId,
            isoDate: overrideCellTarget.isoDate,
            ...payload
        });
        toast.success(
            `Updated ${overrideCellTarget.employeeName} (${overrideCellTarget.displayDate}) to ${payload.code}`
        );
        setOverrideCellTarget(null);
    };

    const handleExportCSV = useCallback(() => {
        if (viewMode === "matrix") {
            const headers = [
                "Employee Code",
                "Employee Name",
                "Department",
                "Assigned Shift",
                ...daysInMonth.map((d) => `${d.dayNum} ${d.weekday}`),
                "Present",
                "Late",
                "Leave",
                "Holiday",
                "Weekly Off",
                "Absent",
                "Net Payable Days"
            ];
            const rows = reportRows.map((r) => [
                r.empCode,
                `"${r.employeeName}"`,
                `"${r.department}"`,
                `"${r.shiftName}"`,
                ...daysInMonth.map((d) => {
                    const cell = r.dailyStatuses[d.dayNum];
                    return cell?.isLate ? "P(L)" : cell?.code || "-";
                }),
                r.presentCount,
                r.lateCount,
                r.leaveCount,
                r.holidayCount,
                r.weeklyOffCount,
                r.absentCount,
                r.payableDays
            ]);
            const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `Attendance_Matrix_${MONTHS[monthIndex]}_${year}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Exported 30-Day Matrix CSV for ${MONTHS[monthIndex]} ${year}`);
        } else {
            const headers = [
                "Employee Code",
                "Employee Name",
                "Department",
                "Shift",
                "Calendar Days",
                "Target Working Days",
                "Present Days",
                "Paid Leaves",
                "Holidays",
                "Weekly Offs",
                "Late Count",
                "Late LOP Penalty",
                "Unpaid Absences",
                "Total LOP Days",
                "Overtime Hours",
                "Net Payable Days"
            ];
            const rows = reportRows.map((r) => [
                r.empCode,
                `"${r.employeeName}"`,
                `"${r.department}"`,
                `"${r.shiftName}"`,
                r.totalCalendarDays,
                r.workingDaysTarget,
                r.presentCount,
                r.leaveCount,
                r.holidayCount,
                r.weeklyOffCount,
                r.lateCount,
                r.latePenaltyDays,
                r.absentCount,
                r.lopDays,
                r.overtimeHours,
                r.payableDays
            ]);
            const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `Payroll_Attendance_Summary_${MONTHS[monthIndex]}_${year}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Exported Payroll Summary Sheet for ${MONTHS[monthIndex]} ${year}`);
        }
    }, [viewMode, daysInMonth, reportRows, monthIndex, year]);

    const getSelectedLog = () => store.globalLogs.find((l) => l.id === selectedLogId) || null;

    return {
        monthName: MONTHS[monthIndex],
        year,
        setYear,
        departmentFilter,
        setDepartmentFilter,
        searchQuery,
        setSearchQuery,
        highlightFilter,
        setHighlightFilter,
        viewMode,
        setViewMode,
        density,
        setDensity,
        daysInMonth,
        reportRows,
        columnTotals,
        footerStats,
        handlePrevMonth: () => setMonthIndex((p) => (p === 0 ? 11 : p - 1)),
        handleNextMonth: () => setMonthIndex((p) => (p === 11 ? 0 : p + 1)),
        handleExportCSV,
        handleCellClick,
        selectedLogId,
        setSelectedLogId,
        getSelectedLog,
        overrideCellTarget,
        setOverrideCellTarget,
        handleSaveCellOverride
    };
}