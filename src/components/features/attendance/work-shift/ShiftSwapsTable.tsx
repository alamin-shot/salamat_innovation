"use client";
import { ShiftSwapRequest } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ShiftSwapsTableProps {
    swapRequests: ShiftSwapRequest[];
    onReviewSwap: (id: string, status: "Approved" | "Rejected") => void;
}

export function ShiftSwapsTable({ swapRequests, onReviewSwap }: ShiftSwapsTableProps) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell>Requester</TableHeadCell>
                <TableHeadCell>Swap With</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Shift Exchange</TableHeadCell>
                <TableHeadCell>Reason</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-right">Action</TableHeadCell>
            </TableHeader>
            <TableBody>
                {swapRequests.map((s) => (
                    <TableRow key={s.id}>
                        <TableCell className="font-semibold text-xs text-gray-900">{s.requesterName}</TableCell>
                        <TableCell className="font-semibold text-xs text-gray-900">{s.targetEmployeeName}</TableCell>
                        <TableCell className="text-xs text-gray-700">{s.date}</TableCell>
                        <TableCell className="text-xs font-medium text-indigo-700">{s.fromShift} ↔ {s.toShift}</TableCell>
                        <TableCell className="text-xs text-gray-500">{s.reason}</TableCell>
                        <TableCell>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : s.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                            >
                                {s.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            {s.status === "Pending" && (
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => onReviewSwap(s.id, "Approved")}
                                        title="Approve & Swap Roster"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => onReviewSwap(s.id, "Rejected")}
                                        title="Reject Swap"
                                    >
                                        <XCircle className="w-4 h-4 text-rose-500" />
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}