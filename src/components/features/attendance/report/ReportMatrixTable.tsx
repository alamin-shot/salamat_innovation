"use client";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";
import { ReportCellData } from "@/types/attendance.types";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { RotateCcw, LayoutGrid, List } from "lucide-react";

export function ReportMatrixTable({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    const isDetailed = manager.density === "detailed";

    const isCellDimmed = (cell: ReportCellData | undefined) => {
        if (manager.highlightFilter === "ALL" || !cell) return false;
        if (manager.highlightFilter === "LATE") return !cell.isLate;
        return cell.code !== manager.highlightFilter;
    };

    // --- THE MICRO-CELL ARCHITECTURE ---
    const renderMatrixBadge = (row: (typeof manager.reportRows)[number], dayNum: number, weekday: string) => {
        const cell = row.dailyStatuses[dayNum];
        const dimmed = isCellDimmed(cell);
        const dimClass = dimmed ? "opacity-20 scale-90" : "opacity-100";

        let badgeContent = null;

        if (!cell || cell.code === "-") {
            badgeContent = (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    className="w-6 h-6 rounded-full flex items-center justify-center mx-auto text-gray-400 hover:bg-gray-100 font-bold text-xs transition"
                >—</button>
            );
        } else if (cell.code === "P") {
            badgeContent = (
                <button
                    onClick={() => manager.handleCellClick(row, dayNum)}
                    className="relative w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-200 mx-auto cursor-pointer hover:ring-2 hover:ring-emerald-400 transition"
                >
                    P
                    {cell.isLate && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 text-white text-[7px] flex items-center justify-center font-extrabold shadow-2xs">L</span>}
                </button>
            );
        } else if (cell.code === "A") {
            badgeContent = <button onClick={() => manager.handleCellClick(row, dayNum)} className="w-6 h-6 rounded-full bg-rose-100/90 text-rose-600 font-bold text-[10px] flex items-center justify-center mx-auto cursor-pointer hover:ring-2 hover:ring-rose-300 transition">A</button>;
        } else if (cell.code === "LV") {
            badgeContent = <button onClick={() => manager.handleCellClick(row, dayNum)} className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-[10px] flex items-center justify-center border border-cyan-200 mx-auto cursor-pointer hover:ring-2 hover:ring-cyan-400 transition">L</button>;
        } else {
            badgeContent = <button onClick={() => manager.handleCellClick(row, dayNum)} className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center border border-amber-200 mx-auto cursor-pointer hover:ring-2 hover:ring-amber-400 transition">H</button>;
        }

        return (
            <div className={`flex flex-col items-center justify-center gap-1 transition-all ${dimClass}`}>
                {badgeContent}

                {/* PROGRESSIVE DISCLOSURE: Detailed Timing Layer */}
                {isDetailed && (
                    <div className="flex flex-col items-center justify-center h-[22px]">
                        {(cell && cell.code === "P") && (cell.punchIn || cell.punchOut) ? (
                            <div className="text-center leading-[1.1]">
                                <span className="text-[9px] font-mono text-emerald-700 block tracking-tighter whitespace-nowrap">{cell.punchIn ? cell.punchIn.replace(" ", "") : "--:--"}</span>
                                <span className="text-[9px] font-mono text-gray-400 block tracking-tighter whitespace-nowrap">{cell.punchOut ? cell.punchOut.replace(" ", "") : "--:--"}</span>
                            </div>
                        ) : (
                            <span className="text-[9px] text-transparent select-none">-</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
            <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600 bg-white">

                {/* Highlight Filters */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    {(["P", "A", "LV", "H", "LATE"] as const).map((code) => (
                        <button
                            key={code}
                            onClick={() => manager.setHighlightFilter(manager.highlightFilter === code ? "ALL" : code)}
                            className={`px-2 py-0.5 rounded-md font-bold uppercase transition ${manager.highlightFilter === code ? "bg-brand-primary text-white" : "hover:bg-gray-50"}`}
                        >
                            {code}
                        </button>
                    ))}

                    {manager.highlightFilter !== "ALL" && (
                        <button onClick={() => manager.setHighlightFilter("ALL")} className="flex items-center gap-1 text-brand-primary font-bold ml-2">
                            <RotateCcw className="w-3 h-3" /> Reset Filter
                        </button>
                    )}
                </div>

                {/* THE DENSITY SWITCHER */}
                <div className="flex items-center p-0.5 bg-gray-100/80 rounded-md border border-gray-200">
                    <button
                        onClick={() => manager.setDensity("compact")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-bold transition-all ${!isDetailed ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" /> Compact
                    </button>
                    <button
                        onClick={() => manager.setDensity("detailed")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-bold transition-all ${isDetailed ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                    >
                        <List className="w-3.5 h-3.5" /> Detailed Times
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full overflow-x-auto overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse min-w-max">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th colSpan={32} className="py-1.5 text-center text-[11px] font-bold text-gray-700">Day of Month</th>
                        </tr>
                        <tr className="border-b border-gray-200 bg-white text-gray-700">
                            {/* RESPONSIVE FIX: Shrunk min-w on mobile, changed text to just "Attendee" on mobile */}
                            <th className="py-2.5 px-2 sm:px-4 font-bold sticky left-0 bg-white z-20 border-r border-gray-100 min-w-[110px] sm:min-w-[235px]">
                                <span className="hidden sm:inline">Name of Attendee</span>
                                <span className="sm:hidden text-center block">Attendee</span>
                            </th>

                            {manager.daysInMonth.map((d) => (
                                <th key={d.dayNum} className={`py-2 px-1.5 text-center border-r border-gray-50 transition-all duration-300 ${isDetailed ? "min-w-[64px]" : "min-w-[40px]"}`}>
                                    <div className="font-bold text-gray-800 text-[11px]">{d.dayNum}</div>
                                    <div className="text-[9px] font-normal text-gray-400">{d.weekday}</div>
                                </th>
                            ))}
                            <th className="py-2.5 px-3 text-center font-bold sticky right-0 bg-white z-20 border-l border-gray-100">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {manager.reportRows.map((row, idx) => {
                            // Extract just the last name for mobile screens
                            const lastName = row.employeeName.split(' ').pop();

                            return (
                                <tr key={row.employeeId} className="hover:bg-gray-50/70">
                                    {/* RESPONSIVE FIX: Adjusted padding for mobile */}
                                    <td className="py-2.5 px-2 sm:px-4 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                                            {/* Hide index number on mobile to save space */}
                                            <span className="text-[11px] text-gray-400 w-4 hidden sm:block">{idx + 1}.</span>

                                            {/* Shrink avatar slightly on mobile */}
                                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[9px] sm:text-[10px] shrink-0 ${getAvatarColorClass(row.employeeId)}`}>
                                                {getInitials(row.employeeName)}
                                            </div>

                                            <div className="flex flex-col overflow-hidden">
                                                {/* Switch between Full Name (Desktop) and Last Name (Mobile) */}
                                                <span className="font-bold text-gray-900 text-[11px] sm:text-xs leading-tight truncate max-w-[65px] sm:max-w-[140px]">
                                                    <span className="hidden sm:inline">{row.employeeName}</span>
                                                    <span className="sm:hidden">{lastName}</span>
                                                </span>
                                                {/* Hide department on mobile completely */}
                                                <span className="text-[10px] text-gray-400 hidden sm:block truncate">{row.department} • {row.shiftName}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {manager.daysInMonth.map((d) => (
                                        <td key={d.dayNum} className={`py-1.5 px-1 align-middle text-center border-r border-gray-50 transition-all duration-300 ${isDetailed ? "min-w-[64px]" : "min-w-[40px]"}`}>
                                            {renderMatrixBadge(row, d.dayNum, d.weekday)}
                                        </td>
                                    ))}

                                    <td className="py-2 px-3 sticky right-0 bg-white z-10 border-l border-gray-100 text-center shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                                        <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-bold text-gray-700 bg-gray-50">
                                            {row.presentCount}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        <tr className="bg-gray-50/90 font-bold text-gray-900 border-t-2 border-gray-200">
                            {/* RESPONSIVE FIX: Match padding */}
                            <td className="py-3 px-2 sm:px-4 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 text-[11px] sm:text-xs text-center sm:text-left">Total</td>
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