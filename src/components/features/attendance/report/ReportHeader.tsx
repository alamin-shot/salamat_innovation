"use client";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ChevronLeft, ChevronRight, Download, CalendarDays, BarChart3 } from "lucide-react";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";

export function ReportHeader({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    return (
        // RESPONSIVE FIX: flex-col on mobile, flex-row on larger screens
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <h1 className="text-xl font-bold text-gray-900 mr-2">Attendance Report</h1>
                <div className="inline-flex items-center border border-gray-200 rounded-md bg-white h-9 px-1 shadow-2xs">
                    <button onClick={manager.handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-semibold text-gray-800 min-w-[90px] text-center">
                        {manager.monthName}
                    </span>
                    <button onClick={manager.handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                {/* RESPONSIVE FIX: w-full on mobile, fixed w-24 on desktop */}
                <div className="w-full sm:w-24">
                    <CustomSelect value={manager.year} options={["2025", "2026", "2027"]} onChange={manager.setYear} />
                </div>
            </div>

            {/* RESPONSIVE FIX: w-full on mobile to allow buttons to stretch */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto flex-1">
                    <button
                        onClick={() => manager.setViewMode("matrix")}
                        className={`flex-1 justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${manager.viewMode === "matrix" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <CalendarDays className="w-3.5 h-3.5" /> 30-Day Matrix
                    </button>
                    <button
                        onClick={() => manager.setViewMode("analytics")}
                        className={`flex-1 justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${manager.viewMode === "analytics" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" /> Payroll Summary
                    </button>
                </div>

                <Button variant="default" onClick={manager.handleExportCSV} className="h-9 flex items-center justify-center gap-1.5 w-full sm:w-auto">
                    <Download className="w-4 h-4" /> Export
                </Button>
            </div>
        </div>
    );
}