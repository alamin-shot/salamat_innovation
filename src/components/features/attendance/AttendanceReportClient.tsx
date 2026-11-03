"use client";
import { useState } from "react";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import { ChevronLeft, ChevronRight, Download, CalendarDays, BarChart3 } from "lucide-react";

export function AttendanceReportClient() {
    const manager = useAttendanceReportManager();
    const [locationData, setLocationData] = useState<{
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    } | null>(null);

    const renderMatrixBadge = (
        cell: { code: string; isLate?: boolean; logId?: string } | undefined
    ) => {
        if (!cell || cell.code === "-") {
            return <span className="text-gray-400 font-bold text-xs">—</span>;
        }
        if (cell.code === "P") {
            return (
                <button
                    onClick={() => cell.logId && manager.setSelectedLogId(cell.logId)}
                    className={`relative w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-200 mx-auto ${cell.logId ? "cursor-pointer hover:ring-2 hover:ring-emerald-400" : "cursor-default"
                        }`}
                    title={cell.isLate ? "Present (Late Arrival) — Click to view log" : "Present"}
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
                <span className="w-6 h-6 rounded-full bg-rose-100/90 text-rose-600 font-bold text-[10px] flex items-center justify-center mx-auto">
                    A
                </span>
            );
        }
        if (cell.code === "LV") {
            return (
                <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center mx-auto">
                    L
                </span>
            );
        }
        return (
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center mx-auto">
                H
            </span>
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-5 p-4 sm:p-6 lg:p-8">
            {/* Top Bar matching screenshot */}
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

            {/* Program / Department Header Card matching screenshot */}
            <div className="erp-card bg-white p-4 flex flex-wrap items-center justify-between gap-4 border border-gray-100 shadow-2xs">
                <div className="flex flex-col gap-1.5 w-64">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        PROGRAM
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
                    <span className="text-[11px] text-gray-500">
                        Month/Year: <strong className="text-gray-800">{manager.monthName} {manager.year}</strong>
                    </span>
                </div>

                <div className="text-right">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                        DAILY ATTENDANCE RECORD
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Click any green Present pill with a log to inspect punch timestamps & GPS
                    </p>
                </div>
            </div>

            {/* Main Report Card (Zero Padding + Full Viewport Height) */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                {/* Legend Strip matching screenshot */}
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-5 text-xs text-gray-600 bg-white">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                            P
                        </span>
                        Present
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center justify-center">
                            A
                        </span>
                        Absent
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center">
                            L
                        </span>
                        Leave
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center">
                            H
                        </span>
                        Holiday
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                            L
                        </span>
                        Late
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="font-bold text-gray-400">—</span> Non-working day
                    </span>
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
                                    <th className="py-2.5 px-4 font-bold sticky left-0 bg-white z-20 border-r border-gray-100 min-w-[230px]">
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
                                                        {row.department}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {manager.daysInMonth.map((d) => (
                                            <td
                                                key={d.dayNum}
                                                className="py-2 px-1 text-center border-r border-gray-50"
                                            >
                                                {renderMatrixBadge(row.dailyStatuses[d.dayNum])}
                                            </td>
                                        ))}
                                        <td className="py-2 px-3 sticky right-0 bg-white z-10 border-l border-gray-100 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-bold text-gray-700 bg-gray-50">
                                                {row.presentCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {/* Daily Totals Footer Row matching screenshot */}
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
                    /* Enterprise Payroll & Overtime Summary Table */
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Employee</TableHeadCell>
                            <TableHeadCell>Department</TableHeadCell>
                            <TableHeadCell className="text-center">Present Days</TableHeadCell>
                            <TableHeadCell className="text-center">Late Arrivals</TableHeadCell>
                            <TableHeadCell className="text-center">Absent Days</TableHeadCell>
                            <TableHeadCell className="text-center">Total Worked</TableHeadCell>
                            <TableHeadCell className="text-center">Overtime (OT)</TableHeadCell>
                            <TableHeadCell className="text-right">Net Payable Days</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {manager.reportRows.map((r) => (
                                <TableRow key={r.employeeId}>
                                    <TableCell>
                                        <div className="font-semibold text-gray-900 text-xs">{r.employeeName}</div>
                                        <div className="text-[10px] text-gray-400">{r.empCode}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600">{r.department}</TableCell>
                                    <TableCell className="text-center font-bold text-emerald-600">
                                        {r.presentCount}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-amber-600">
                                        {r.lateCount}
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-rose-600">
                                        {r.absentCount}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs">
                                        {r.totalWorkedHours}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs text-indigo-600 font-semibold">
                                        {r.overtimeHours}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {r.payableDays} Days
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Bottom Colored Summary Pills matching screenshot */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {manager.footerStats.present} PRESENT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600">
                        {manager.footerStats.absent} ABSENT
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                        {manager.footerStats.leave} LEAVE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                        {manager.footerStats.holiday} HOLIDAY
                    </span>
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                        {manager.footerStats.late} LATE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {manager.footerStats.employees} EMPLOYEES
                    </span>
                </div>
            </div>

            <PunchDetailsDrawer
                log={manager.getSelectedLog()}
                onClose={() => manager.setSelectedLogId(null)}
                onOpenLocation={(loc) => setLocationData(loc)}
            />
            <PunchLocationDrawer locationData={locationData} onClose={() => setLocationData(null)} />
        </div>
    );
}