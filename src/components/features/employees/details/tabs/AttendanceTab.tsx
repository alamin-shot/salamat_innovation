"use client";
import { useState, useMemo } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LocationViewDrawer, PunchLocationData } from "../drawers/LocationViewDrawer";
import { MapPin } from "lucide-react";

export function AttendanceTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const logs = manager.employee.attendanceLogs;
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Local state for the Location View Drawer
    const [activeLocation, setActiveLocation] = useState<PunchLocationData | null>(null);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => log.inDate.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [logs, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const stats = { late: 1, absent: 24, regular: 1, early: 0, holiday: 0, weekend: 4 };
    const total = 30;
    const strokeWidth = 12;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const renderCircle = (val: number, color: string, offsetAmount: number) => {
        const strokeDasharray = `${(val / total) * circumference} ${circumference}`;
        const strokeDashoffset = -offsetAmount;
        return val > 0 ? (
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke={color} strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-500" />
        ) : null;
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="erp-card bg-white p-6 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Attendance</h2>
                    <p className="text-xs text-gray-500 mt-1">November 2026 — current month overview</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    {/* Donut Chart Card */}
                    <div className="lg:col-span-1 border border-gray-100 rounded-lg p-5 flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">Attendance Overview</h3>
                            <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late</span> <span>{stats.late} days</span></div>
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Absent</span> <span>{stats.absent} days</span></div>
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Regular</span> <span>{stats.regular} days</span></div>
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Early</span> <span>{stats.early} days</span></div>
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Holiday</span> <span>{stats.holiday} days</span></div>
                                <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-800"></div> Weekend</span> <span>{stats.weekend} days</span></div>
                            </div>
                        </div>
                        <div className="relative w-32 h-32 transform -rotate-90">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth={strokeWidth} />
                                {renderCircle(stats.absent, "#f43f5e", 0)}
                                {renderCircle(stats.weekend, "#1f2937", (stats.absent / total) * circumference)}
                                {renderCircle(stats.regular, "#10b981", ((stats.absent + stats.weekend) / total) * circumference)}
                                {renderCircle(stats.late, "#f59e0b", ((stats.absent + stats.weekend + stats.regular) / total) * circumference)}
                            </svg>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-rose-100 rounded-lg p-4 bg-rose-50/30 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                <span className="w-3 h-1 bg-rose-500 rounded-full"></span> Average Behaviour
                            </div>
                            <div className="text-xl font-bold text-rose-600">Absent</div>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                <span className="w-3 h-1 bg-rose-500 rounded-full"></span> Work Shift Hours
                            </div>
                            <div className="text-xl font-bold text-gray-900">260:00:00</div>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                <span className="w-3 h-1 bg-emerald-500 rounded-full"></span> Attendance Hours
                            </div>
                            <div className="text-xl font-bold text-gray-900">3:34:11</div>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-center">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                        <span className="w-3 h-1 bg-rose-500 rounded-full"></span> Work Availability
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">1.37%</div>
                                </div>
                                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded border border-rose-200">Bad</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Logs Table */}
            <div className="erp-card bg-white overflow-hidden flex flex-col shadow-sm min-h-[300px]">
                <div className="p-4 border-b border-gray-100">
                    <input type="text" placeholder="Search by date..." className="erp-input max-w-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <Table>
                    <TableHeader>
                        <TableHeadCell>In Date</TableHeadCell>
                        <TableHeadCell>Punch In</TableHeadCell>
                        <TableHeadCell>In Location</TableHeadCell>
                        <TableHeadCell>Punch Out</TableHeadCell>
                        <TableHeadCell>Out Location</TableHeadCell>
                        <TableHeadCell>Behavior</TableHeadCell>
                        <TableHeadCell>Total Hours</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {paginatedLogs.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No attendance logs found.</TableCell></TableRow>
                        ) : (
                            paginatedLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium text-gray-900">{log.inDate}</TableCell>
                                    <TableCell>{log.punchIn}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setActiveLocation({ type: "In", ip: log.inLocation })}
                                            className="flex items-center gap-1.5 text-xs font-mono text-brand-primary hover:text-brand-primary/80 hover:underline transition-colors"
                                            title="View Map"
                                        >
                                            <MapPin className="w-3 h-3" /> {log.inLocation}
                                        </button>
                                    </TableCell>
                                    <TableCell>{log.punchOut}</TableCell>
                                    <TableCell>
                                        {log.outLocation !== "—" ? (
                                            <button
                                                onClick={() => setActiveLocation({ type: "Out", ip: log.outLocation })}
                                                className="flex items-center gap-1.5 text-xs font-mono text-brand-primary hover:text-brand-primary/80 hover:underline transition-colors"
                                                title="View Map"
                                            >
                                                <MapPin className="w-3 h-3" /> {log.outLocation}
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${log.behavior === "regular" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                            log.behavior === "late" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"
                                            }`}>
                                            {log.behavior}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.totalHours}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="mt-auto border-t border-gray-100 p-4">
                    <Pagination currentPage={currentPage} totalPages={totalPages} perPage={perPage} onPageChange={setCurrentPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }} />
                </div>
            </div>

            {/* Render the Drawer */}
            <LocationViewDrawer
                isOpen={!!activeLocation}
                onClose={() => setActiveLocation(null)}
                locationData={activeLocation}
            />
        </div>
    );
}