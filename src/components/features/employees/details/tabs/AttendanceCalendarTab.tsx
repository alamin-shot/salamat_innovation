"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AttendanceCalendarTab({ manager }: { manager: EmployeeDetailManagerType }) {
    // Generate a simple mock grid for November 2026 starting on Sunday
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const blanks = Array.from({ length: 0 }); // Nov 2026 starts on Sunday

    return (
        <div className="erp-card bg-white p-6 shadow-sm h-full">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Attendance Overview</h2>
                <p className="text-xs text-gray-500 mt-1">Monthly attendance calendar and statistics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

                {/* Calendar Grid */}
                <div className="lg:col-span-2 border border-gray-100 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                        <h3 className="text-sm font-bold text-gray-900">November 2026</h3>
                        <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4 text-center">
                        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                            <div key={d} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d}</div>
                        ))}
                        {blanks.map((_, i) => <div key={`b-${i}`}></div>)}
                        {daysInMonth.map(day => {
                            const isLate = day === 1;
                            const isRegular = day === 2;
                            return (
                                <div key={day} className="flex justify-center items-center h-8">
                                    <div className={`w-8 h-8 flex items-center justify-center text-sm rounded-full font-medium ${isLate ? "bg-amber-100 text-amber-700 ring-1 ring-amber-400" :
                                        isRegular ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500" :
                                            "text-gray-700 hover:bg-gray-100"
                                        }`}>
                                        {day}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Absent</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-800"></div> Weekend</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Early</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Regular</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Holiday</span>
                    </div>
                </div>

                {/* Right Side Stats */}
                <div className="border border-gray-100 rounded-lg p-5 shadow-sm bg-gray-50/30 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Leave Overview</h3>
                    <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Days</span>
                            <span className="text-xl font-bold text-gray-900">0</span>
                        </div>
                        <div className="flex flex-col gap-3 text-sm text-gray-700 font-medium">
                            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late</span> <span>0 days</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Absent</span> <span>0 days</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Regular</span> <span>0 days</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Early</span> <span>0 days</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}