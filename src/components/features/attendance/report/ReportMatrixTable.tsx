"use client";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";
import { ReportCellData } from "@/types/attendance.types";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { RotateCcw } from "lucide-react";

export function ReportMatrixTable({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    const isCellDimmed = (cell: ReportCellData | undefined) => {
        if (manager.highlightFilter === "ALL" || !cell) return false;
        if (manager.highlightFilter === "LATE") return !cell.isLate;
        return cell.code !== manager.highlightFilter;
    };

    const renderMatrixBadge = (row: (typeof manager.reportRows)[number], dayNum: number, weekday: string) => {
        const cell = row.dailyStatuses[dayNum];
        const dimmed = isCellDimmed(cell);
        const dimClass = dimmed ? "opacity-20 scale-90" : "opacity-100";

        if (!cell || cell.code === "-") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-gray-400 hover:bg-gray-100 font-bold text-xs transition ${dimClass}`}
                >—</button>
            );
        }

        if (cell.code === "P") {
            return (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    className={`relative w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-200 mx-auto cursor-pointer hover:ring-2 hover:ring-emerald-400 transition ${dimClass}`}
                >
                    P
                    {cell.isLate && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 text-white text-[7px] flex items-center justify-center font-extrabold shadow-2xs">L</span>}
                </button>
            );
        }

        if (cell.code === "A") {
            return <button onClick={() => manager.handleCellClick(row, dayNum)} className={`w-6 h-6 rounded-full bg-rose-100/90 text-rose-600 font-bold text-[10px] flex items-center justify-center mx-auto cursor-pointer hover:ring-2 hover:ring-rose-300 transition ${dimClass}`}>A</button>;
        }

        if (cell.code === "LV") {
            return <button onClick={() => manager.handleCellClick(row, dayNum)} className={`w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center border border-cyan-200 mx-auto cursor-pointer hover:ring-2 hover:ring-cyan-400 transition ${dimClass}`}>L</button>;
        }

        return <button onClick={() => manager.handleCellClick(row, dayNum)} className={`w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center border border-amber-200 mx-auto cursor-pointer hover:ring-2 hover:ring-amber-400 transition ${dimClass}`}>H</button>;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
            {/* RESPONSIVE FIX: flex-col on mobile so the legend doesn't push the "Reset Filter" button off-screen */}
            <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600 bg-white">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    {(["P", "A", "LV", "H", "LATE"] as const).map((code) => (
                        <button
                            key={code}
                            onClick={() => manager.setHighlightFilter(manager.highlightFilter === code ? "ALL" : code)}
                            className={`px-2 py-0.5 rounded-md font-bold uppercase transition ${manager.highlightFilter === code ? "bg-brand-primary text-white" : "hover:bg-gray-50"
                                }`}
                        >
                            {code}
                        </button>
                    ))}
                </div>
                {manager.highlightFilter !== "ALL" && (
                    <button onClick={() => manager.setHighlightFilter("ALL")} className="flex items-center gap-1 text-brand-primary font-bold">
                        <RotateCcw className="w-3 h-3" /> Reset Filter
                    </button>
                )}
            </div>

            <div className="flex-1 w-full overflow-x-auto overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse min-w-max">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th colSpan={32} className="py-1.5 text-center text-[11px] font-bold text-gray-700">Day of Month</th>
                        </tr>
                        <tr className="border-b border-gray-200 bg-white text-gray-700">
                            <th className="py-2.5 px-4 font-bold sticky left-0 bg-white z-20 border-r border-gray-100 min-w-[235px]">Name of Attendee</th>
                            {manager.daysInMonth.map((d) => (
                                <th key={d.dayNum} className="py-2 px-1.5 text-center min-w-[34px] border-r border-gray-50">
                                    <div className="font-bold text-gray-800 text-[11px]">{d.dayNum}</div>
                                    <div className="text-[9px] font-normal text-gray-400">{d.weekday}</div>
                                </th>
                            ))}
                            <th className="py-2.5 px-3 text-center font-bold sticky right-0 bg-white z-20 border-l border-gray-100">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {manager.reportRows.map((row, idx) => (
                            <tr key={row.employeeId} className="hover:bg-gray-50/70">
                                <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[11px] text-gray-400 w-4">{idx + 1}.</span>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarColorClass(row.employeeId)}`}>
                                            {getInitials(row.employeeName)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-xs leading-tight">{row.employeeName}</span>
                                            <span className="text-[10px] text-gray-400">{row.department} • {row.shiftName}</span>
                                        </div>
                                    </div>
                                </td>
                                {manager.daysInMonth.map((d) => (
                                    <td key={d.dayNum} className="py-2 px-1 text-center border-r border-gray-50">
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

                        <tr className="bg-gray-50/90 font-bold text-gray-900 border-t-2 border-gray-200">
                            <td className="py-3 px-4 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 text-xs">Total</td>
                            {manager.daysInMonth.map((d) => (
                                <td key={d.dayNum} className="py-3 px-1 text-center text-[11px]">{manager.columnTotals[d.dayNum] || 0}</td>
                            ))}
                            <td className="py-3 px-3 sticky right-0 bg-gray-50 z-10 border-l border-gray-200 text-center text-xs">{manager.footerStats.present}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-white flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider">
                <button onClick={() => manager.setHighlightFilter(manager.highlightFilter === "P" ? "ALL" : "P")} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:ring-2 hover:ring-emerald-300 transition">{manager.footerStats.present} PRESENT</button>
                <button onClick={() => manager.setHighlightFilter(manager.highlightFilter === "A" ? "ALL" : "A")} className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 hover:ring-2 hover:ring-rose-300 transition">{manager.footerStats.absent} ABSENT</button>
                <button onClick={() => manager.setHighlightFilter(manager.highlightFilter === "LV" ? "ALL" : "LV")} className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 hover:ring-2 hover:ring-cyan-300 transition">{manager.footerStats.leave} LEAVE</button>
                <button onClick={() => manager.setHighlightFilter(manager.highlightFilter === "H" ? "ALL" : "H")} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 hover:ring-2 hover:ring-amber-300 transition">{manager.footerStats.holiday} HOLIDAY</button>
                <button onClick={() => manager.setHighlightFilter(manager.highlightFilter === "LATE" ? "ALL" : "LATE")} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:ring-2 hover:ring-orange-300 transition">{manager.footerStats.late} LATE</button>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">{manager.footerStats.employees} EMPLOYEES</span>
            </div>
        </div>
    );
}