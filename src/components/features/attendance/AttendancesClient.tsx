"use client";
import { useState } from "react";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { AttendanceFormDrawer } from "./drawers/AttendanceFormDrawer";
import { PunchDetailsDrawer } from "./drawers/PunchDetailsDrawer";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import {
    Plus,
    Filter,
    Columns,
    Eye,
    MapPin,
    Edit,
    Trash2,
    XCircle,
    Ban,
    ShieldAlert
} from "lucide-react";

export function AttendancesClient() {
    const manager = useAttendancesManager();
    const [showColMenu, setShowColMenu] = useState(false);

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
            case "late":
                return "bg-rose-50 text-rose-600 border-rose-200";
            case "early":
                return "bg-cyan-50 text-cyan-600 border-cyan-200";
            case "regular":
                return "bg-emerald-50 text-emerald-600 border-emerald-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Attendances</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Master biometric & IP attendance ledger across all outlets and shifts.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => manager.setIsFilterOpen(!manager.isFilterOpen)}
                        className="h-9 flex items-center gap-1.5 bg-white"
                    >
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </Button>

                    {/* Columns Toggle Dropdown */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColMenu(!showColMenu)}
                            className="h-9 flex items-center gap-1.5 bg-white"
                        >
                            <Columns className="w-3.5 h-3.5" /> Columns
                        </Button>
                        {showColMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40 flex flex-col gap-2 text-xs">
                                <div className="font-bold text-gray-700 border-b pb-1.5">Toggle Columns</div>
                                {Object.entries(manager.visibleColumns).map(([key, isVis]) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer capitalize text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={isVis}
                                            onChange={() => manager.toggleColumn(key)}
                                            className="rounded text-brand-primary"
                                        />
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button variant="default" onClick={manager.openAddDrawer} className="h-9 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Attendance
                    </Button>
                </div>
            </div>

            {/* Collapsible Filter Drawer Bar */}
            {manager.isFilterOpen && (
                <div className="erp-card bg-white p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Department</label>
                        <CustomSelect
                            value={manager.departmentFilter}
                            options={["All Departments", "Marketing", "Sales", "HR & Administration", "Procurement"]}
                            onChange={manager.setDepartmentFilter}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Behavior</label>
                        <CustomSelect
                            value={manager.behaviorFilter}
                            options={["All Behaviors", "Regular", "Late", "Early", "Absent"]}
                            onChange={manager.setBehaviorFilter}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Work Shift</label>
                        <CustomSelect
                            value={manager.shiftFilter}
                            options={["All Shifts", "Showroom", "Head Office"]}
                            onChange={manager.setShiftFilter}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-[38px]"
                            onClick={() => {
                                manager.setDepartmentFilter("All Departments");
                                manager.setBehaviorFilter("All Behaviors");
                                manager.setShiftFilter("All Shifts");
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Master Table Card - Zero Internal Padding & Full Viewport Flex */}
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
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(
                                                        log.employeeId
                                                    )}`}
                                                >
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

                                        {manager.visibleColumns.date && (
                                            <TableCell className="text-xs text-gray-700">{log.date}</TableCell>
                                        )}
                                        {manager.visibleColumns.leave && (
                                            <TableCell className="text-xs text-gray-500">{log.leave}</TableCell>
                                        )}
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
                                        {manager.visibleColumns.punchIn && (
                                            <TableCell className="text-xs font-medium text-gray-800">
                                                {log.punchIn}
                                            </TableCell>
                                        )}
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
                                                            <ShieldAlert
                                                                className="w-3.5 h-3.5 text-amber-500 ml-1"
                                                            />
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
                                        {manager.visibleColumns.punchOut && (
                                            <TableCell className="text-xs font-medium text-gray-800">
                                                {log.punchOut}
                                            </TableCell>
                                        )}
                                        {manager.visibleColumns.behavior && (
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getBehaviorPill(
                                                        log.behavior
                                                    )}`}
                                                >
                                                    {log.behavior}
                                                </span>
                                            </TableCell>
                                        )}
                                        {manager.visibleColumns.breakTimes && (
                                            <TableCell className="text-xs text-gray-700 font-mono">
                                                {log.breakTimes}
                                            </TableCell>
                                        )}
                                        {manager.visibleColumns.totalHours && (
                                            <TableCell className="text-xs font-bold text-gray-900 font-mono">
                                                {log.totalHours}
                                            </TableCell>
                                        )}

                                        {/* Inline Action Buttons replacing the 3-dot menu (Edit, Reject, Cancel, Delete) */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => manager.handleRowAction(log.id, "Edit")}
                                                    title="Edit Attendance"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => manager.handleRowAction(log.id, "Reject")}
                                                    title="Reject Attendance"
                                                >
                                                    <XCircle className="w-4 h-4 text-amber-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => manager.handleRowAction(log.id, "Cancel")}
                                                    title="Cancel Attendance"
                                                >
                                                    <Ban className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="destructive-ghost"
                                                    size="icon-sm"
                                                    onClick={() => manager.handleRowAction(log.id, "Delete")}
                                                    title="Delete Attendance"
                                                >
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

            {manager.selectedIds.length > 0 && (
                <BulkActionBar
                    selectedCount={manager.selectedIds.length}
                    onClearSelection={() => manager.setSelectedIds([])}
                >
                    <Button variant="default" size="sm" onClick={() => manager.handleBulkAction("Approved")}>
                        Bulk Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => manager.handleBulkAction("Rejected")}>
                        Bulk Reject
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => manager.handleBulkAction("Delete")}>
                        Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            <AttendanceFormDrawer manager={manager} />
            <PunchDetailsDrawer
                log={manager.getDetailsLog()}
                onClose={() => manager.setDetailsLogId(null)}
                onOpenLocation={(loc) => manager.setLocationDrawerData(loc)}
            />
            <PunchLocationDrawer
                locationData={manager.locationDrawerData}
                onClose={() => manager.setLocationDrawerData(null)}
            />
        </div>
    );
}