"use client";
import { useAttendanceRequestsManager } from "@/hooks/attendance_hooks/useAttendanceRequestsManager";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Edit, Trash2, Plus, FileSearch } from "lucide-react";
import { AttendanceRequestDrawer } from "./drawers/AttendanceRequestDrawer";

export function AttendanceRequestsClient() {
    const manager = useAttendanceRequestsManager();

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Attendance Requests</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Attendance Request
                </Button>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input type="text" placeholder="Search employee..." className="erp-input max-w-sm" value={manager.searchQuery} onChange={e => manager.setSearchQuery(e.target.value)} />
                    <Button variant="outline" size="sm" className="h-[34px]">Filter</Button>
                </div>

                <Table containerClassName="flex-1 min-h-[350px]">
                    <TableHeader>
                        <TableHeadCell>Employee</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Punch In</TableHeadCell>
                        <TableHeadCell>Punch Out</TableHeadCell>
                        <TableHeadCell>Note</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <FileSearch className="w-12 h-12 text-gray-300" />
                                        <span>Nothing to show here</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            manager.requests.map(req => (
                                <TableRow key={req.id} className="group hover:bg-gray-50">
                                    <TableCell className="font-semibold text-gray-900">{req.employeeName}</TableCell>
                                    <TableCell className="text-gray-700">{req.date}</TableCell>
                                    <TableCell className="text-gray-700">{req.punchIn}</TableCell>
                                    <TableCell className="text-gray-700">{req.punchOut}</TableCell>
                                    <TableCell className="text-gray-500 text-xs max-w-[200px] truncate">{req.note}</TableCell>
                                    <TableCell>
                                        <CustomSelect value={req.status} options={["Pending", "Approved", "Rejected"]} onChange={() => { }} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(req.id)}><Edit className="w-4 h-4 text-gray-600" /></Button>
                                            <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(req.id)}><Trash2 className="w-4 h-4" /></Button>
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

            <AttendanceRequestDrawer manager={manager} />
        </div>
    );
}