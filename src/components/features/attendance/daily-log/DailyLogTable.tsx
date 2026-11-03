"use client";
import * as React from "react";
import { GlobalAttendanceLog, AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { MapPin, ChevronRight, ChevronDown, Edit, ShieldAlert } from "lucide-react";

interface DailyLogTableProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    paginatedLogs: GlobalAttendanceLog[];
    visibleCols: Record<string, boolean>;
    expandedIds: string[];
    toggleExpand: (id: string) => void;
    getBehaviorBadge: (behavior: string) => string;
    setLocationDrawerData: (data: any) => void;
    setSelfieAuditData: (data: any) => void;
    setOverrideTarget: (log: GlobalAttendanceLog) => void;
    setOverrideBehavior: (behavior: AttendanceBehavior) => void;
    setOverrideStatus: (status: AttendanceRecordStatus) => void;
    currentPage: number;
    totalPages: number;
    perPage: number;
    setCurrentPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export function DailyLogTable({
    searchQuery, setSearchQuery, paginatedLogs, visibleCols, expandedIds,
    toggleExpand, getBehaviorBadge, setLocationDrawerData, setSelfieAuditData,
    setOverrideTarget, setOverrideBehavior, setOverrideStatus,
    currentPage, totalPages, perPage, setCurrentPage, setPerPage
}: DailyLogTableProps) {
    return (
        <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search..."
                    className="erp-input max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="text-xs text-gray-400">
                    Click any Selfie or IP address to open the Biometric & Location Audit Drawer
                </span>
            </div>

            <Table containerClassName="flex-1 min-h-[420px]">
                <TableHeader>
                    <TableHeadCell className="w-8"></TableHeadCell>
                    <TableHeadCell className="w-64 sticky left-0 bg-gray-50/95 z-10">Profile</TableHeadCell>
                    {visibleCols.punchIn && <TableHeadCell>Punch In</TableHeadCell>}
                    {visibleCols.inSelfie && <TableHeadCell>In Selfie</TableHeadCell>}
                    {visibleCols.inLocation && <TableHeadCell>In Location</TableHeadCell>}
                    {visibleCols.outLocation && <TableHeadCell>Out Location</TableHeadCell>}
                    {visibleCols.punchOut && <TableHeadCell>Punch Out</TableHeadCell>}
                    {visibleCols.outSelfie && <TableHeadCell>Out Selfie</TableHeadCell>}
                    {visibleCols.behavior && <TableHeadCell>Behavior</TableHeadCell>}
                    {visibleCols.breakTimes && <TableHeadCell>Break Times</TableHeadCell>}
                    {visibleCols.totalHours && <TableHeadCell>Total Hours</TableHeadCell>}
                </TableHeader>
                <TableBody>
                    {paginatedLogs.map((log) => {
                        const isExpanded = expandedIds.includes(log.id);
                        const isOutsideGeofence = log.segments[0] && !log.segments[0].isGeofenceVerified;
                        return (
                            <React.Fragment key={log.id}>
                                <TableRow className="hover:bg-emerald-50/30 transition-colors">
                                    <TableCell>
                                        <button
                                            onClick={() => toggleExpand(log.id)}
                                            className="p-1 rounded hover:bg-gray-100 text-gray-400"
                                        >
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    </TableCell>
                                    <TableCell className="sticky left-0 bg-white z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(log.employeeId)}`}>
                                                {getInitials(log.employeeName)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 text-xs">{log.employeeName}</span>
                                                <span className="text-[11px] text-gray-400">ID: {log.empCode}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {visibleCols.punchIn && <TableCell className="text-xs font-medium text-gray-800">{log.punchIn}</TableCell>}
                                    {visibleCols.inSelfie && (
                                        <TableCell>
                                            {log.inSelfie ? (
                                                <button
                                                    onClick={() => setSelfieAuditData({ log, punchType: "In" })}
                                                    className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-brand-primary transition"
                                                    title="Inspect Biometric Selfie"
                                                >
                                                    <img src={log.inSelfie} alt={log.employeeName} className="w-full h-full object-cover" />
                                                </button>
                                            ) : <span className="text-gray-400">—</span>}
                                        </TableCell>
                                    )}
                                    {visibleCols.inLocation && (
                                        <TableCell>
                                            <button
                                                onClick={() => setLocationDrawerData({
                                                    type: "In", ip: log.inLocation, coordinates: log.inCoordinates,
                                                    address: log.inAddress, employeeName: log.employeeName
                                                })}
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
                                    {visibleCols.outLocation && (
                                        <TableCell>
                                            {log.outLocation !== "—" ? (
                                                <button
                                                    onClick={() => setLocationDrawerData({
                                                        type: "Out", ip: log.outLocation, coordinates: log.outCoordinates,
                                                        address: log.outAddress, employeeName: log.employeeName
                                                    })}
                                                    className="inline-flex items-center gap-1 text-xs font-mono text-gray-700 underline hover:text-brand-primary"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                    {log.outLocation}
                                                </button>
                                            ) : <span className="text-gray-400">—</span>}
                                        </TableCell>
                                    )}
                                    {visibleCols.punchOut && <TableCell className="text-xs text-gray-700">{log.punchOut}</TableCell>}
                                    {visibleCols.outSelfie && (
                                        <TableCell>
                                            {log.outSelfie ? (
                                                <button
                                                    onClick={() => setSelfieAuditData({ log, punchType: "Out" })}
                                                    className="w-8 h-8 rounded-full overflow-hidden border border-gray-300"
                                                >
                                                    <img src={log.outSelfie} alt="Out Selfie" className="w-full h-full object-cover" />
                                                </button>
                                            ) : <span className="text-gray-400">—</span>}
                                        </TableCell>
                                    )}
                                    {visibleCols.behavior && (
                                        <TableCell>
                                            <button
                                                onClick={() => {
                                                    setOverrideTarget(log);
                                                    setOverrideBehavior(log.behavior);
                                                    setOverrideStatus(log.status);
                                                }}
                                                className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold border capitalize hover:opacity-80 ${getBehaviorBadge(log.behavior)}`}
                                                title="Click to override behavior"
                                            >
                                                {log.behavior} <Edit className="w-2.5 h-2.5 opacity-60" />
                                            </button>
                                        </TableCell>
                                    )}
                                    {visibleCols.breakTimes && <TableCell className="text-xs font-mono text-gray-700">{log.breakTimes}</TableCell>}
                                    {visibleCols.totalHours && <TableCell className="text-xs font-mono font-bold text-gray-900">{log.totalHours}</TableCell>}
                                </TableRow>

                                {isExpanded && (
                                    <TableRow className="bg-slate-50/90">
                                        <TableCell colSpan={11} className="px-12 py-3 text-xs">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <strong>Shift:</strong> {log.workShift} ({log.outlet}) • <strong>Device:</strong> {log.segments[0]?.deviceInfo || "Terminal"}
                                                </div>
                                                {log.auditReason && (
                                                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                                                        <strong>Audit Note:</strong> {log.auditReason}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-auto border-t border-gray-100">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    perPage={perPage}
                    onPageChange={setCurrentPage}
                    onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
                />
            </div>
        </div>
    );
}