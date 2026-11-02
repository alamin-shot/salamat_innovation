"use client";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { Edit, Trash2, Eye, Plus, MapPin, XCircle } from "lucide-react";
import { AttendanceFormDrawer } from "./drawers/AttendanceFormDrawer";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";

export function AttendancesClient() {
    const manager = useAttendancesManager();

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Attendances</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Attendance
                </Button>
            </div>

            {/* Zero padding on erp-card to flush table edges */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full">

                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search profile or code..." className="erp-input max-w-sm" value={manager.searchQuery} onChange={e => manager.setSearchQuery(e.target.value)} />
                    <Button variant="outline" size="sm" className="h-[34px]">Filter</Button>
                </div>

                <Table containerClassName="flex-1 min-h-[350px]">
                    <TableHeader>
                        <TableHeadCell>Profile</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Leave</TableHeadCell>
                        <TableHeadCell>Punch records</TableHeadCell>
                        <TableHeadCell>Punch In</TableHeadCell>
                        <TableHeadCell>In Location</TableHeadCell>
                        <TableHeadCell>Out Location</TableHeadCell>
                        <TableHeadCell>Punch Out</TableHeadCell>
                        <TableHeadCell>Behavior</TableHeadCell>
                        <TableHeadCell>Break Times</TableHeadCell>
                        <TableHeadCell>Total Hours</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.logs.length === 0 ? (
                            <TableRow><TableCell colSpan={12} className="text-center py-12 text-gray-500">No logs found.</TableCell></TableRow>
                        ) : (
                            manager.logs.map(log => (
                                <TableRow key={log.id} className="group hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${getAvatarColorClass(log.employeeId)}`}>{getInitials(log.employeeName)}</div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 text-xs">{log.employeeName}</span>
                                                <span className="text-[10px] text-gray-500">ID: {log.empCode}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-700 whitespace-nowrap">{log.date}</TableCell>
                                    <TableCell className="text-xs text-gray-400">{log.leave}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" className="h-7 text-xs font-semibold py-0" onClick={() => manager.openDetails(log.id)}>
                                            <Eye className="w-3 h-3 mr-1.5" /> View Details
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-xs">{log.punchIn}</TableCell>
                                    <TableCell className="text-[11px] font-mono text-gray-500 whitespace-nowrap"><MapPin className="w-3 h-3 inline mr-1 text-brand-primary" />{log.inLocation}</TableCell>
                                    <TableCell className="text-[11px] font-mono text-gray-500 whitespace-nowrap">{log.outLocation !== "—" ? <><MapPin className="w-3 h-3 inline mr-1 text-brand-primary" />{log.outLocation}</> : "—"}</TableCell>
                                    <TableCell className="text-xs">{log.punchOut}</TableCell>
                                    <TableCell>
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${log.behavior === "regular" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : log.behavior === "late" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-cyan-50 text-cyan-600 border-cyan-200"}`}>{log.behavior}</span>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium">{log.breakTimes}</TableCell>
                                    <TableCell className="text-xs font-bold text-gray-900">{log.totalHours}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {log.status === "Approved" && (
                                                <Button variant="ghost" size="icon-sm" onClick={() => manager.updateStatus(log.id, "Rejected")} title="Reject">
                                                    <XCircle className="w-4 h-4 text-amber-600" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(log.id)}><Edit className="w-4 h-4 text-gray-600" /></Button>
                                            <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(log.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="mt-auto border-t border-gray-100 p-4">
                    <Pagination currentPage={manager.table.currentPage} totalPages={manager.table.totalPages} perPage={manager.table.perPage} onPageChange={manager.table.onPageChange} onPerPageChange={manager.table.onPerPageChange} />
                </div>
            </div>

            <AttendanceFormDrawer manager={manager} />
            <PunchDetailsDrawer manager={manager} />
        </div>
    );
}