"use client";
import * as React from "react";
import { LeaveRequestItem, LeaveRequestStatus } from "@/types/leaves.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Eye, Edit, Trash2, CheckCircle2, XCircle, FileSearch } from "lucide-react";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";

interface LeaveRequestTableProps {
    requests: LeaveRequestItem[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: (checked: boolean) => void;
    onReview: (id: string, status: LeaveRequestStatus) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    table: any;
}

export function LeaveRequestTable({
    requests, selectedIds, onToggleSelect, onToggleSelectAll,
    onReview, onView, onEdit, onDelete, table
}: LeaveRequestTableProps) {
    return (
        <>
            <Table containerClassName="flex-1 min-h-[400px]">
                <TableHeader>
                    <TableHeadCell className="w-10">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-brand-primary"
                            checked={requests.length > 0 && selectedIds.length === requests.length}
                            onChange={(e) => onToggleSelectAll(e.target.checked)}
                        />
                    </TableHeadCell>
                    <TableHeadCell>Employee</TableHeadCell>
                    <TableHeadCell>Leave Type</TableHeadCell>
                    <TableHeadCell>Duration</TableHeadCell>
                    <TableHeadCell>Period</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {requests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-20 text-gray-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FileSearch className="w-12 h-12 text-gray-300" />
                                    <span className="text-xs font-medium">No leave requests found</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        requests.map((req) => (
                            <TableRow key={req.id} className="hover:bg-gray-50/80">
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary"
                                        checked={selectedIds.includes(req.id)}
                                        onChange={() => onToggleSelect(req.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(req.employeeId)}`}>
                                            {getInitials(req.employeeName)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 text-xs">{req.employeeName}</span>
                                            <span className="text-[10px] text-gray-400">{req.empCode}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-gray-700">{req.leaveTypeName}</TableCell>
                                <TableCell>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        {req.duration}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-gray-800">
                                    {req.duration === "Multi-Day" ? `${req.startDate} to ${req.endDate}` : req.startDate}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : req.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200"
                                                : req.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-200"
                                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                        }`}>
                                        {req.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {req.status === "Pending" && (
                                            <>
                                                <Button variant="ghost" size="icon-sm" onClick={() => onReview(req.id, "Approved")} title="Approve">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm" onClick={() => onReview(req.id, "Rejected")} title="Reject">
                                                    <XCircle className="w-4 h-4 text-rose-500" />
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="ghost" size="icon-sm" onClick={() => onView(req.id)} title="View Details">
                                            <Eye className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(req.id)} title="Edit">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(req.id)} title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="mt-auto border-t border-gray-100">
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    perPage={table.perPage}
                    onPageChange={table.onPageChange}
                    onPerPageChange={table.onPerPageChange}
                />
            </div>
        </>
    );
}