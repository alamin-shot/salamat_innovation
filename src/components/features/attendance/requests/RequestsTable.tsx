"use client";
import { AttendanceRequestItem, AttendanceRecordStatus } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { CheckCircle2, XCircle, Edit, Trash2, FileSearch, ArrowRight } from "lucide-react";

interface RequestsTableProps {
    paginated: AttendanceRequestItem[];
    handleReview: (req: AttendanceRequestItem, status: AttendanceRecordStatus) => void;
    onEditClick: (req: AttendanceRequestItem) => void;
    handleDelete: (id: string) => void;
    currentPage: number;
    totalPages: number;
    perPage: number;
    setCurrentPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
}

export function RequestsTable({
    paginated, handleReview, onEditClick, handleDelete, currentPage, totalPages, perPage, setCurrentPage, setPerPage
}: RequestsTableProps) {
    return (
        <>
            {/* RESPONSIVE FIX: Added overflow-x-auto w-full */}
            <Table containerClassName="flex-1 min-h-[400px] overflow-x-auto w-full">
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
                    {paginated.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-20">
                                <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                    <FileSearch className="w-12 h-12 text-gray-300" />
                                    <span className="text-xs font-medium">Nothing to show here</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginated.map((req) => (
                            <TableRow key={req.id} className="hover:bg-gray-50/70">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(
                                                req.employeeId
                                            )}`}
                                        >
                                            {getInitials(req.employeeName)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-xs">
                                                {req.employeeName}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                {req.empCode} • {req.requestType}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-gray-700">{req.date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="text-gray-400 line-through">
                                            {req.originalPunchIn}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-gray-400" />
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {req.punchIn}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="text-gray-400 line-through">
                                            {req.originalPunchOut}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-gray-400" />
                                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                            {req.punchOut}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                                    {req.note}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === "Approved"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : req.status === "Pending"
                                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                                : "bg-rose-50 text-rose-600 border-rose-200"
                                            }`}
                                    >
                                        {req.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {req.status === "Pending" && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleReview(req, "Approved")}
                                                    title="Approve & Sync to Attendances"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => handleReview(req, "Rejected")}
                                                    title="Reject Request"
                                                >
                                                    <XCircle className="w-4 h-4 text-rose-500" />
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => onEditClick(req)}
                                            title="Edit Request"
                                        >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => handleDelete(req.id)}
                                            title="Delete Request"
                                        >
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    perPage={perPage}
                    onPageChange={setCurrentPage}
                    onPerPageChange={(v) => {
                        setPerPage(v);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </>
    );
}