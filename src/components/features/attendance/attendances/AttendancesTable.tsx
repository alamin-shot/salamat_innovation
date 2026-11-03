"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { Eye, MapPin, Edit, Trash2, XCircle, Ban, ShieldAlert } from "lucide-react";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";

export function AttendancesTable({ manager }: { manager: ReturnType<typeof useAttendancesManager> }) {

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.logs.map((l) => l.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const getBehaviorPill = (behavior: string) => {
        switch (behavior) {
            case "late": return "bg-rose-50 text-rose-600 border-rose-200";
            case "early": return "bg-cyan-50 text-cyan-600 border-cyan-200";
            case "regular": return "bg-emerald-50 text-emerald-600 border-emerald-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
            <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search by employee name, ID, or IP..."
                    className="erp-input max-w-xs"
                    value={manager.searchQuery}
                    onChange={(e) => manager.setSearchQuery(e.target.value)}
                />
                <span className="text-xs text-gray-500 font-medium">
                    Showing {manager.logs.length} of {manager.totalEntries} entries
                </span>
            </div>

            <Table containerClassName="flex-1 min-h-[420px]">
                <TableHeader>
                    <TableHeadCell className="w-10">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-brand-primary cursor-pointer"
                            checked={manager.logs.length > 0 && manager.selectedIds.length === manager.logs.length}
                            onChange={toggleSelectAll}
                        />
                    </TableHeadCell>
                    <TableHeadCell className="w-64">Profile</TableHeadCell>
                    {manager.visibleColumns.date && <TableHeadCell>Date</TableHeadCell>}
                    {manager.visibleColumns.leave && <TableHeadCell>Leave</TableHeadCell>}
                    {manager.visibleColumns.punchRecords && <TableHeadCell>Punch records</TableHeadCell>}
                    {manager.visibleColumns.punchIn && <TableHeadCell>Punch In</TableHeadCell>}
                    {manager.visibleColumns.inLocation && <TableHeadCell>In Location</TableHeadCell>}
                    {manager.visibleColumns.outLocation && <TableHeadCell>Out Location</TableHeadCell>}
                    {manager.visibleColumns.punchOut && <TableHeadCell>Punch Out</TableHeadCell>}
                    {manager.visibleColumns.behavior && <TableHeadCell>Behavior</TableHeadCell>}
                    {manager.visibleColumns.breakTimes && <TableHeadCell>Break Times</TableHeadCell>}
                    {manager.visibleColumns.totalHours && <TableHeadCell>Total Hours</TableHeadCell>}
                    <TableHeadCell className="text-right w-44">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {manager.logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={13} className="text-center py-16 text-gray-400">
                                No attendance records match your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        manager.logs.map((log) => {
                            const isOutsideGeofence = log.segments[0] && !log.segments[0].isGeofenceVerified;
                            return (
                                <TableRow key={log.id} className="group hover:bg-gray-50/80">
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-brand-primary cursor-pointer"
                                            checked={manager.selectedIds.includes(log.id)}
                                            onChange={() => toggleSelect(log.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(log.employeeId)}`}>
                                                {getInitials(log.employeeName)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 text-xs">
                                                    {log.employeeName}
                                                </span>
                                                <span className="text-[11px] text-gray-400">ID: {log.empCode}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {manager.visibleColumns.date && <TableCell className="text-xs text-gray-700">{log.date}</TableCell>}
                                    {manager.visibleColumns.leave && <TableCell className="text-xs text-gray-500">{log.leave}</TableCell>}
                                    {manager.visibleColumns.punchRecords && (
                                        <TableCell>
                                            <button
                                                onClick={() => manager.setDetailsLogId(log.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 shadow-2xs transition"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-gray-600" /> View Details
                                            </button>
                                        </TableCell>
                                    )}
                                    {manager.visibleColumns.punchIn && <TableCell className="text-xs font-medium text-gray-800">{log.punchIn}</TableCell>}
                                    {manager.visibleColumns.inLocation && (
                                        <TableCell>
                                            <button
                                                onClick={() =>
                                                    manager.setLocationDrawerData({
                                                        type: "In",
                                                        ip: log.inLocation,
                                                        coordinates: log.inCoordinates,
                                                        address: log.inAddress,
                                                        employeeName: log.employeeName
                                                    })
                                                }
                                                className="inline-flex items-center gap-1 text-xs font-mono text-gray-700 underline hover:text-brand-primary"
                                            >
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                {log.inLocation}
                                                {isOutsideGeofence && (
                                                    <span title="Outside Geofence" className="inline-flex items-center">
                                                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 ml-1" />
                                                    </span>
                                                )}
                                            </button>
                                        </TableCell>
                                    )}
                                    {manager.visibleColumns.outLocation && (
                                        <TableCell>
                                            {log.outLocation !== "—" ? (
                                                <button
                                                    onClick={() =>
                                                        manager.setLocationDrawerData({
                                                            type: "Out",
                                                            ip: log.outLocation,
                                                            coordinates: log.outCoordinates,
                                                            address: log.outAddress,
                                                            employeeName: log.employeeName
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1 text-xs font-mono text-gray-700 underline hover:text-brand-primary"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                    {log.outLocation}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                    )}
                                    {manager.visibleColumns.punchOut && <TableCell className="text-xs font-medium text-gray-800">{log.punchOut}</TableCell>}
                                    {manager.visibleColumns.behavior && (
                                        <TableCell>
                                            <span className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getBehaviorPill(log.behavior)}`}>
                                                {log.behavior}
                                            </span>
                                        </TableCell>
                                    )}
                                    {manager.visibleColumns.breakTimes && <TableCell className="text-xs text-gray-700 font-mono">{log.breakTimes}</TableCell>}
                                    {manager.visibleColumns.totalHours && <TableCell className="text-xs font-bold text-gray-900 font-mono">{log.totalHours}</TableCell>}

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.handleRowAction(log.id, "Edit")} title="Edit Attendance">
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.handleRowAction(log.id, "Reject")} title="Reject Attendance">
                                                <XCircle className="w-4 h-4 text-amber-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.handleRowAction(log.id, "Cancel")} title="Cancel Attendance">
                                                <Ban className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleRowAction(log.id, "Delete")} title="Delete Attendance">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            <div className="mt-auto border-t border-gray-100">
                <Pagination
                    currentPage={manager.table.currentPage}
                    totalPages={manager.table.totalPages}
                    perPage={manager.table.perPage}
                    onPageChange={manager.table.onPageChange}
                    onPerPageChange={manager.table.onPerPageChange}
                />
            </div>
        </div>
    );
}