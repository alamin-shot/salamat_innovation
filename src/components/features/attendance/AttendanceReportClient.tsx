"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";

export function AttendanceReportClient() {
    const store = useGlobalAttendanceStore();
    const [department, setDepartment] = useState("Choose department");

    // Generate 30 days for November
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    // Group unique employees from logs to form the matrix rows
    const uniqueEmployees = Array.from(new Set(store.globalLogs.map(l => l.employeeId))).map(id => {
        const log = store.globalLogs.find(l => l.employeeId === id)!;
        return {
            id,
            name: log.employeeName,
            empCode: log.empCode,
            department: "Marketing" // Mock department for display
        };
    });

    const getStatusForDay = (empId: string, day: number) => {
        // Mock logic: randomly generate P, A, L, or Late based on the day
        if (day === 3 || day === 15) return "A";
        if (day === 10) return "L";
        return "P";
    };

    const getStatusPill = (status: string) => {
        switch (status) {
            case "P": return <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">P</span>;
            case "A": return <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">A</span>;
            case "L": return <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200">L</span>;
            default: return <span className="text-gray-300">-</span>;
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900 mr-4">Attendance Report</h1>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white">
                        <button className="px-2 py-1.5 hover:bg-gray-50"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                        <span className="text-sm font-semibold px-2">November</span>
                        <button className="px-2 py-1.5 hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                    </div>
                    <div className="w-24">
                        <CustomSelect value="2026" options={["2025", "2026", "2027"]} onChange={() => { }} />
                    </div>
                </div>
                <Button variant="outline" size="sm" className="h-9 border-brand-primary text-brand-primary">
                    <Download className="w-4 h-4 mr-2" /> Export
                </Button>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">

                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1 w-64">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Program</label>
                        <CustomSelect value={department} options={["Choose department", "Marketing", "Sales", "IT"]} onChange={setDepartment} />
                        <span className="text-xs text-gray-400 mt-1">Month/Year: November 2026</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-gray-700 tracking-widest uppercase">Daily Attendance Record</span>
                    </div>
                </div>

                {/* Status Legend */}
                <div className="px-4 py-3 border-b border-gray-100 flex gap-4 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1.5">{getStatusPill("P")} Present</span>
                    <span className="flex items-center gap-1.5">{getStatusPill("A")} Absent</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">L</span> Leave</span>
                    <span className="flex items-center gap-1.5">{getStatusPill("L")} Late</span>
                </div>

                {/* Horizontal Scrolling Matrix */}
                <div className="flex-1 w-full overflow-x-auto custom-scrollbar relative">
                    <table className="w-full text-left text-sm border-collapse min-w-max">
                        <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-200 sticky top-0 z-20">
                            <tr>
                                <th className="p-4 font-semibold w-[250px] sticky left-0 bg-gray-50/95 border-r border-gray-200 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Name of Attendee</th>
                                {daysInMonth.map(day => (
                                    <th key={day} className="p-2 text-center border-r border-gray-100 min-w-[40px]">
                                        <div className="text-[10px] uppercase font-bold text-gray-400">Day</div>
                                        <div className="font-bold text-gray-800">{day}</div>
                                    </th>
                                ))}
                                <th className="p-4 font-bold text-gray-900 text-center sticky right-0 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {uniqueEmployees.map((emp, index) => (
                                <tr key={emp.id} className="hover:bg-gray-50/50">
                                    {/* Sticky First Column */}
                                    <td className="p-3 sticky left-0 bg-white border-r border-gray-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 font-mono w-4">{index + 1}.</span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarColorClass(emp.id)}`}>{getInitials(emp.name)}</div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-xs truncate max-w-[140px]">{emp.name}</span>
                                                <span className="text-[10px] text-gray-500">{emp.department}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Grid Cells */}
                                    {daysInMonth.map(day => (
                                        <td key={day} className="p-1 border-r border-gray-50 text-center">
                                            <div className="flex justify-center w-full">
                                                {getStatusPill(getStatusForDay(emp.id, day))}
                                            </div>
                                        </td>
                                    ))}

                                    {/* Sticky Last Column */}
                                    <td className="p-2 sticky right-0 bg-white text-center font-bold text-gray-700 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        {daysInMonth.filter(d => getStatusForDay(emp.id, d) === "P").length}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals Sticky Bar */}
                <div className="border-t border-gray-200 bg-gray-50 p-3 flex gap-4 text-[10px] font-bold">
                    <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded">19 PRESENT</span>
                    <span className="text-rose-600 bg-rose-100 px-3 py-1 rounded">381 ABSENT</span>
                    <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded">0 LEAVE</span>
                    <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded">7 LATE</span>
                </div>
            </div>
        </div>
    );
}