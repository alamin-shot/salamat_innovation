"use client";
import { useState, useEffect } from "react";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";
import { MatrixCellCode, AttendanceBehavior, ReportCellData } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Drawer } from "@/components/ui/Drawer";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import { ChevronLeft, ChevronRight, Download, CalendarDays, BarChart3, RotateCcw } from "lucide-react";

export function AttendanceReportClient() {
    const manager = useAttendanceReportManager();
    const [locationData, setLocationData] = useState<{
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    } | null>(null);

    // Cell Override Drawer Local State
    const [overrideCode, setOverrideCode] = useState<MatrixCellCode>("P");
    const [overridePunchIn, setOverridePunchIn] = useState("10:00 AM");
    const [overridePunchOut, setOverridePunchOut] = useState("07:00 PM");
    const [overrideBehavior, setOverrideBehavior] = useState<AttendanceBehavior>("regular");
    const [overrideLeaveType, setOverrideLeaveType] = useState("Casual Leave");
    const [overrideNote, setOverrideNote] = useState("");

    useEffect(() => {
        if (manager.overrideCellTarget) {
            const cur = manager.overrideCellTarget.currentCell;
            setOverrideCode(cur.code === "A" ? "P" : cur.code);
            setOverridePunchIn(cur.punchIn || "10:00 AM");
            setOverridePunchOut(cur.punchOut || "07:00 PM");
            setOverrideBehavior(cur.isLate ? "late" : "regular");
            setOverrideLeaveType(cur.leaveTitle || "Casual Leave");
            setOverrideNote(cur.note || "");
        }
    }, [manager.overrideCellTarget]);

    const isCellDimmed = (cell: ReportCellData | undefined) => {
        if (manager.highlightFilter === "ALL" || !cell) return false;
        if (manager.highlightFilter === "LATE") return !cell.isLate;
        return cell.code !== manager.highlightFilter;
    };

    const renderMatrixBadge = (
        row: (typeof manager.reportRows)[number],
        dayNum: number,
        weekday: string
    ) => {
        const cell = row.dailyStatuses[dayNum];
        const dimmed = isCellDimmed(cell);
        const dimClass = dimmed ? "opacity-20 scale-90" : "opacity-100";
        const dateLabel = `${String(dayNum).padStart(2, "0")} ${manager.monthName.slice(0, 3)} ${manager.year} (${weekday})`;

        if (!cell || cell.code === "-") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    title={`${row.employeeName} • ${dateLabel}\nStatus: Weekly Off-Day (${row.shiftName} Shift)\nClick to override day status`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-gray-400 hover:bg-gray-100 font-bold text-xs transition ${dimClass}`}
                >
                    —
                </button>
            );
        }

        if (cell.code === "P") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    title={`${row.employeeName} • ${dateLabel}\nStatus: Present ${cell.isLate ? "(Late Arrival)" : "(On Time)"}\nIn: ${cell.punchIn || "10:00 AM"} | Out: ${cell.punchOut || "—"} | Worked: ${cell.totalHours || "09:00:00"}\nClick to inspect punch records`}
                    className={`relative w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-200 mx-auto cursor-pointer hover:ring-2 hover:ring-emerald-400 transition ${dimClass}`}
                >
                    P
                    {cell.isLate && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 text-white text-[7px] flex items-center justify-center font-extrabold shadow-2xs">
                            L
                        </span>
                    )}
                </button>
            );
        }

        if (cell.code === "A") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    title={`${row.employeeName} • ${dateLabel}\nStatus: Absent (Unpaid / LOP)\nClick to regularize or mark Leave/Holiday`}
                    className={`w-6 h-6 rounded-full bg-rose-100/90 text-rose-600 font-bold text-[10px] flex items-center justify-center mx-auto cursor-pointer hover:ring-2 hover:ring-rose-300 transition ${dimClass}`}
                >
                    A
                </button>
            );
        }

        if (cell.code === "LV") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    title={`${row.employeeName} • ${dateLabel}\nStatus: Approved Paid Leave (${cell.leaveTitle || "Casual Leave"})\nClick to edit`}
                    className={`w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center border border-cyan-200 mx-auto cursor-pointer hover:ring-2 hover:ring-cyan-400 transition ${dimClass}`}
                >
                    L
                </button>
            );
        }

        return (
            <button
                onClick={() => manager.handleCellClick(row, dayNum)}
                title={`${row.employeeName} • ${dateLabel}\nStatus: Public Holiday (${cell.note || "Paid Holiday"})\nClick to edit`}
                className={`w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center border border-amber-200 mx-auto cursor-pointer hover:ring-2 hover:ring-amber-400 transition ${dimClass}`}
            >
                H
            </button>
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-5 p-4">
            {/* Top Bar */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900 mr-2">Attendance Report</h1>
                    <div className="inline-flex items-center border border-gray-200 rounded-md bg-white h-9 px-1 shadow-2xs">
                        <button
                            onClick={manager.handlePrevMonth}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-xs font-semibold text-gray-800 min-w-[90px] text-center">
                            {manager.monthName}
                        </span>
                        <button
                            onClick={manager.handleNextMonth}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="w-24">
                        <CustomSelect
                            value={manager.year}
                            options={["2025", "2026", "2027"]}
                            onChange={manager.setYear}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                        <button
                            onClick={() => manager.setViewMode("matrix")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${manager.viewMode === "matrix"
                                ? "bg-brand-primary text-white shadow-2xs"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <CalendarDays className="w-3.5 h-3.5" /> 30-Day Matrix
                        </button>
                        <button
                            onClick={() => manager.setViewMode("analytics")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${manager.viewMode === "analytics"
                                ? "bg-brand-primary text-white shadow-2xs"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <BarChart3 className="w-3.5 h-3.5" /> Payroll Summary
                        </button>
                    </div>

                    <Button
                        variant="default"
                        onClick={manager.handleExportCSV}
                        className="h-9 flex items-center gap-1.5"
                    >
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Program / Department & Employee Filter Bar */}
            <div className="erp-card bg-white p-4 flex flex-wrap items-center justify-between gap-4 border border-gray-100 shadow-2xs">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5 w-60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            PROGRAM / DEPARTMENT
                        </span>
                        <CustomSelect
                            value={manager.departmentFilter}
                            options={[
                                "Choose department",
                                "Marketing",
                                "Sales",
                                "HR & Administration",
                                "Procurement"
                            ]}
                            onChange={manager.setDepartmentFilter}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 w-64">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            SEARCH ATTENDEE
                        </span>
                        <input
                            type="text"
                            placeholder="Filter by employee name or ID..."
                            className="erp-input h-[38px]"
                            value={manager.searchQuery}
                            onChange={(e) => manager.setSearchQuery(e.target.value)}
                        />
                    </div>
                    <span className="text-[11px] text-gray-500 pb-2">
                        Month/Year:{" "}
                        <strong className="text-gray-800">
                            {manager.monthName} {manager.year}
                        </strong>
                    </span>
                </div>

                <div className="text-right">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                        DAILY ATTENDANCE RECORD
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Click any cell (P, A, L, H, —) to inspect punch logs or override day status
                    </p>
                </div>
            </div>

            {/* Main Report Card */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                {/* Interactive Filterable Legend Strip */}
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 bg-white">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() =>
                                manager.setHighlightFilter(manager.highlightFilter === "P" ? "ALL" : "P")
                            }
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition ${manager.highlightFilter === "P" ? "bg-emerald-50 ring-1 ring-emerald-300 font-bold" : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                                P
                            </span>
                            Present
                        </button>
                        <button
                            onClick={() =>
                                manager.setHighlightFilter(manager.highlightFilter === "A" ? "ALL" : "A")
                            }
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition ${manager.highlightFilter === "A" ? "bg-rose-50 ring-1 ring-rose-300 font-bold" : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center justify-center">
                                A
                            </span>
                            Absent
                        </button>
                        <button
                            onClick={() =>
                                manager.setHighlightFilter(manager.highlightFilter === "LV" ? "ALL" : "LV")
                            }
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition ${manager.highlightFilter === "LV" ? "bg-cyan-50 ring-1 ring-cyan-300 font-bold" : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center">
                                L
                            </span>
                            Leave
                        </button>
                        <button
                            onClick={() =>
                                manager.setHighlightFilter(manager.highlightFilter === "H" ? "ALL" : "H")
                            }
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition ${manager.highlightFilter === "H" ? "bg-amber-50 ring-1 ring-amber-300 font-bold" : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center">
                                H
                            </span>
                            Holiday
                        </button>
                        <button
                            onClick={() =>
                                manager.setHighlightFilter(manager.highlightFilter === "LATE" ? "ALL" : "LATE")
                            }
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition ${manager.highlightFilter === "LATE" ? "bg-orange-50 ring-1 ring-orange-300 font-bold" : "hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                                L
                            </span>
                            Late
                        </button>
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                            <span className="font-bold text-gray-400">—</span> Non-working day (Shift Off)
                        </span>
                    </div>

                    {manager.highlightFilter !== "ALL" && (
                        <button
                            onClick={() => manager.setHighlightFilter("ALL")}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                        >
                            <RotateCcw className="w-3 h-3" /> Clear Highlight
                        </button>
                    )}
                </div>

                {manager.viewMode === "matrix" ? (
                    <div className="flex-1 w-full overflow-auto custom-scrollbar">
                        <table className="w-full text-left text-xs border-collapse min-w-max">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    <th
                                        colSpan={32}
                                        className="py-1.5 text-center text-[11px] font-bold text-gray-700"
                                    >
                                        Day of Month
                                    </th>
                                </tr>
                                <tr className="border-b border-gray-200 bg-white text-gray-700">
                                    <th className="py-2.5 px-4 font-bold sticky left-0 bg-white z-20 border-r border-gray-100 min-w-[235px]">
                                        Name of Attendee
                                    </th>
                                    {manager.daysInMonth.map((d) => (
                                        <th
                                            key={d.dayNum}
                                            className="py-2 px-1.5 text-center min-w-[34px] border-r border-gray-50"
                                        >
                                            <div className="font-bold text-gray-800 text-[11px]">{d.dayNum}</div>
                                            <div className="text-[9px] font-normal text-gray-400">{d.weekday}</div>
                                        </th>
                                    ))}
                                    <th className="py-2.5 px-3 text-center font-bold sticky right-0 bg-white z-20 border-l border-gray-100">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {manager.reportRows.map((row, idx) => (
                                    <tr key={row.employeeId} className="hover:bg-gray-50/70">
                                        <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-gray-100">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[11px] text-gray-400 w-4">{idx + 1}.</span>
                                                <div
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarColorClass(
                                                        row.employeeId
                                                    )}`}
                                                >
                                                    {getInitials(row.employeeName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-xs leading-tight">
                                                        {row.employeeName}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {row.department} • {row.shiftName}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {manager.daysInMonth.map((d) => (
                                            <td
                                                key={d.dayNum}
                                                className="py-2 px-1 text-center border-r border-gray-50"
                                            >
                                                {renderMatrixBadge(row, d.dayNum, d.weekday)}
                                            </td>
                                        ))}
                                        <td className="py-2 px-3 sticky right-0 bg-white z-10 border-l border-gray-100 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-bold text-gray-700 bg-gray-50">
                                                {row.presentCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {/* Daily Totals Footer Row */}
                                <tr className="bg-gray-50/90 font-bold text-gray-900 border-t-2 border-gray-200">
                                    <td className="py-3 px-4 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 text-xs">
                                        Total
                                    </td>
                                    {manager.daysInMonth.map((d) => (
                                        <td key={d.dayNum} className="py-3 px-1 text-center text-[11px]">
                                            {manager.columnTotals[d.dayNum] || 0}
                                        </td>
                                    ))}
                                    <td className="py-3 px-3 sticky right-0 bg-gray-50 z-10 border-l border-gray-200 text-center text-xs">
                                        {manager.footerStats.present}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Complete Enterprise Payroll & LOP Accounting Table */
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell className="sticky left-0 bg-gray-50 z-10">Employee</TableHeadCell>
                            <TableHeadCell>Shift</TableHeadCell>
                            <TableHeadCell className="text-center">Target Days</TableHeadCell>
                            <TableHeadCell className="text-center">Present (P)</TableHeadCell>
                            <TableHeadCell className="text-center">Paid Leave (L)</TableHeadCell>
                            <TableHeadCell className="text-center">Holidays (H)</TableHeadCell>
                            <TableHeadCell className="text-center">Weekly Off (—)</TableHeadCell>
                            <TableHeadCell className="text-center">Late (Penalty)</TableHeadCell>
                            <TableHeadCell className="text-center">Absent / LOP</TableHeadCell>
                            <TableHeadCell className="text-center">Worked Hours</TableHeadCell>
                            <TableHeadCell className="text-center">Overtime (OT)</TableHeadCell>
                            <TableHeadCell className="text-right">Net Payable Days</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {manager.reportRows.map((r) => (
                                <TableRow key={r.employeeId} className="hover:bg-gray-50/80">
                                    <TableCell className="sticky left-0 bg-white z-10">
                                        <div className="font-semibold text-gray-900 text-xs">{r.employeeName}</div>
                                        <div className="text-[10px] text-gray-400">
                                            {r.empCode} • {r.department}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-gray-700">
                                        {r.shiftName}
                                    </TableCell>
                                    <TableCell className="text-center text-xs text-gray-600 font-mono">
                                        {r.workingDaysTarget}/{r.totalCalendarDays}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-emerald-600">
                                        {r.presentCount}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-cyan-600">
                                        {r.leaveCount}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-amber-600">
                                        {r.holidayCount}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-gray-600">
                                        {r.weeklyOffCount}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-bold text-orange-600">{r.lateCount}</span>
                                        {r.latePenaltyDays > 0 && (
                                            <span className="ml-1 text-[10px] text-rose-600 font-semibold">
                                                (-{r.latePenaltyDays}d LOP)
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-rose-600">
                                        {r.lopDays}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs text-gray-700">
                                        {r.totalWorkedHours}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs text-indigo-600 font-semibold">
                                        {r.overtimeHours}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {r.payableDays} / {r.totalCalendarDays} Days
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Interactive Bottom Summary Pills */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider">
                    <button
                        onClick={() =>
                            manager.setHighlightFilter(manager.highlightFilter === "P" ? "ALL" : "P")
                        }
                        className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:ring-2 hover:ring-emerald-300 transition"
                    >
                        {manager.footerStats.present} PRESENT
                    </button>
                    <button
                        onClick={() =>
                            manager.setHighlightFilter(manager.highlightFilter === "A" ? "ALL" : "A")
                        }
                        className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 hover:ring-2 hover:ring-rose-300 transition"
                    >
                        {manager.footerStats.absent} ABSENT
                    </button>
                    <button
                        onClick={() =>
                            manager.setHighlightFilter(manager.highlightFilter === "LV" ? "ALL" : "LV")
                        }
                        className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 hover:ring-2 hover:ring-cyan-300 transition"
                    >
                        {manager.footerStats.leave} LEAVE
                    </button>
                    <button
                        onClick={() =>
                            manager.setHighlightFilter(manager.highlightFilter === "H" ? "ALL" : "H")
                        }
                        className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 hover:ring-2 hover:ring-amber-300 transition"
                    >
                        {manager.footerStats.holiday} HOLIDAY
                    </button>
                    <button
                        onClick={() =>
                            manager.setHighlightFilter(manager.highlightFilter === "LATE" ? "ALL" : "LATE")
                        }
                        className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:ring-2 hover:ring-orange-300 transition"
                    >
                        {manager.footerStats.late} LATE
                    </button>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {manager.footerStats.employees} EMPLOYEES
                    </span>
                </div>
            </div>

            {/* Existing Punch Details & Location Drawers */}
            <PunchDetailsDrawer
                log={manager.getSelectedLog()}
                onClose={() => manager.setSelectedLogId(null)}
                onOpenLocation={(loc) => setLocationData(loc)}
            />
            <PunchLocationDrawer locationData={locationData} onClose={() => setLocationData(null)} />

            {/* Universal Day Status Override Drawer */}
            <Drawer
                title={
                    manager.overrideCellTarget
                        ? `Manage Day Status — ${manager.overrideCellTarget.employeeName} (${manager.overrideCellTarget.displayDate})`
                        : "Manage Day Status"
                }
                isOpen={!!manager.overrideCellTarget}
                onClose={() => manager.setOverrideCellTarget(null)}
                width="drawer-full-content"
            >
                <div className="flex flex-col h-full pt-6">
                    <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-2xl">
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-gray-600">
                            Changes saved here immediately recalculate the <strong>30-Day Attendance Matrix</strong>,{" "}
                            <strong>Master Attendances Ledger</strong>, and <strong>Net Payable Days</strong>.
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Select Day Classification <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                {[
                                    { code: "P" as MatrixCellCode, label: "Present (P)", cls: "border-emerald-300 bg-emerald-50 text-emerald-700" },
                                    { code: "LV" as MatrixCellCode, label: "Paid Leave (L)", cls: "border-cyan-300 bg-cyan-50 text-cyan-700" },
                                    { code: "H" as MatrixCellCode, label: "Holiday (H)", cls: "border-amber-300 bg-amber-50 text-amber-700" },
                                    { code: "-" as MatrixCellCode, label: "Weekly Off (—)", cls: "border-gray-300 bg-gray-100 text-gray-700" },
                                    { code: "A" as MatrixCellCode, label: "Absent (A)", cls: "border-rose-300 bg-rose-50 text-rose-700" }
                                ].map((item) => (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => setOverrideCode(item.code)}
                                        className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition ${overrideCode === item.code
                                            ? `${item.cls} ring-2 ring-brand-primary`
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {overrideCode === "P" && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 bg-white">
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Punch In</label>
                                    <input
                                        type="text"
                                        className="erp-input"
                                        value={overridePunchIn}
                                        onChange={(e) => setOverridePunchIn(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Punch Out</label>
                                    <input
                                        type="text"
                                        className="erp-input"
                                        value={overridePunchOut}
                                        onChange={(e) => setOverridePunchOut(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Behavior</label>
                                    <CustomSelect
                                        value={overrideBehavior}
                                        options={["regular", "late", "early"]}
                                        onChange={(v) => setOverrideBehavior(v as AttendanceBehavior)}
                                    />
                                </div>
                            </div>
                        )}

                        {overrideCode === "LV" && (
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Leave Allowance Type</label>
                                <CustomSelect
                                    value={overrideLeaveType}
                                    options={["Casual Leave", "Sick Leave", "Earned Leave", "Maternity / Paternity Leave"]}
                                    onChange={setOverrideLeaveType}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Audit Note / Reference</label>
                            <textarea
                                className="erp-input min-h-[90px] py-2"
                                placeholder="e.g. Approved manual attendance or gazetted holiday..."
                                value={overrideNote}
                                onChange={(e) => setOverrideNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                        <Button variant="outline" onClick={() => manager.setOverrideCellTarget(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() =>
                                manager.handleSaveCellOverride({
                                    code: overrideCode,
                                    punchIn: overridePunchIn,
                                    punchOut: overridePunchOut,
                                    behavior: overrideBehavior,
                                    leaveType: overrideLeaveType,
                                    note: overrideNote || "Updated from Attendance Matrix"
                                })
                            }
                        >
                            Apply Status
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}