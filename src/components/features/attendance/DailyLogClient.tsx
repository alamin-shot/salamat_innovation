"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { MapPin, UserCircle2 } from "lucide-react";

export function DailyLogClient() {
    const store = useGlobalAttendanceStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredLogs = store.globalLogs.filter(log =>
        log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.empCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Daily Attendance Log</h1>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">

                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <input type="text" placeholder="Search profile..." className="erp-input max-w-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                <Table containerClassName="flex-1 min-h-[400px]">
                    <TableHeader>
                        <TableHeadCell>Profile</TableHeadCell>
                        <TableHeadCell>Punch In</TableHeadCell>
                        <TableHeadCell>In Selfie</TableHeadCell>
                        <TableHeadCell>In Location</TableHeadCell>
                        <TableHeadCell>Out Location</TableHeadCell>
                        <TableHeadCell>Punch Out</TableHeadCell>
                        <TableHeadCell>Out Selfie</TableHeadCell>
                        <TableHeadCell>Behavior</TableHeadCell>
                        <TableHeadCell>Break Times</TableHeadCell>
                        <TableHeadCell>Total Hours</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {paginatedLogs.length === 0 ? (
                            <TableRow><TableCell colSpan={10} className="text-center py-12 text-gray-500">No logs for today.</TableCell></TableRow>
                        ) : (
                            paginatedLogs.map(log => (
                                <TableRow key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarColorClass(log.employeeId)}`}>{getInitials(log.employeeName)}</div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 text-xs">{log.employeeName}</span>
                                                <span className="text-[10px] text-gray-500">ID: {log.empCode}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-gray-800">{log.punchIn}</TableCell>
                                    <TableCell>
                                        {/* Mocking the Selfie display */}
                                        {log.punchIn !== "—" ? (
                                            <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                                                {log.inSelfie ? <img src={log.inSelfie} alt="selfie" className="w-full h-full object-cover" /> : <UserCircle2 className="w-6 h-6 text-gray-400" />}
                                            </div>
                                        ) : "—"}
                                    </TableCell>
                                    <TableCell className="text-[11px] font-mono text-gray-500 whitespace-nowrap"><MapPin className="w-3 h-3 inline mr-1 text-brand-primary" />{log.inLocation}</TableCell>
                                    <TableCell className="text-[11px] font-mono text-gray-500 whitespace-nowrap">{log.outLocation !== "—" ? <><MapPin className="w-3 h-3 inline mr-1 text-brand-primary" />{log.outLocation}</> : "—"}</TableCell>
                                    <TableCell className="text-xs font-medium text-gray-800">{log.punchOut}</TableCell>
                                    <TableCell>
                                        {log.punchOut !== "—" ? (
                                            <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                                                {log.outSelfie ? <img src={log.outSelfie} alt="selfie" className="w-full h-full object-cover" /> : <UserCircle2 className="w-6 h-6 text-gray-400" />}
                                            </div>
                                        ) : <span className="text-gray-400">—</span>}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${log.behavior === "regular" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : log.behavior === "late" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-cyan-50 text-cyan-600 border-cyan-200"}`}>{log.behavior}</span>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-gray-600">{log.breakTimes}</TableCell>
                                    <TableCell className="text-xs font-bold text-gray-900">{log.totalHours}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="mt-auto border-t border-gray-100 p-4">
                    <Pagination currentPage={currentPage} totalPages={totalPages} perPage={perPage} onPageChange={setCurrentPage} onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }} />
                </div>
            </div>
        </div>
    );
}