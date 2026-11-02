"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";

export function EmployeeProfileBanner({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;
    const initials = getInitials(emp.name);
    const colorClass = getAvatarColorClass(emp.id);

    return (
        <div className="w-full erp-card bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border-t-4 border-t-brand-primary">

            {/* Avatar & Name Info */}
            <div className="flex items-center gap-4 min-w-[240px]">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${colorClass}`}>
                    {initials}
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-gray-900">{emp.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-green-700 bg-green-50 font-bold px-2 py-0.5 rounded border border-green-200">
                            {emp.empCode}
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

            {/* Real-time Status KPIs */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="flex flex-col items-center sm:items-start p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition" onClick={manager.togglePunchSimulation} title="Click to simulate Punch Out">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        <LogIn className="w-3.5 h-3.5 text-emerald-500" /> Check In
                    </div>
                    <div className="text-sm font-bold text-gray-900">{emp.todayCheckIn}</div>
                </div>

                <div className="flex flex-col items-center sm:items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        <LogOut className="w-3.5 h-3.5 text-rose-500" /> Check Out
                    </div>
                    <div className="text-sm font-bold text-gray-900">{emp.todayCheckOut}</div>
                </div>

                <div className="flex flex-col items-center sm:items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Work Shift
                    </div>
                    <div className="text-sm font-bold text-gray-900">{emp.workShift}</div>
                </div>

                <div className="flex flex-col items-center sm:items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Today Duration
                    </div>
                    <div className="text-sm font-bold text-gray-900">{emp.todayDuration}</div>
                </div>
            </div>

        </div>
    );
}