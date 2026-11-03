"use client";
import { BreakTimePolicy } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2 } from "lucide-react";

interface BreakTimePoliciesTableProps {
    policies: BreakTimePolicy[];
    onEdit: (policy: BreakTimePolicy) => void;
    onDelete: (id: string) => void;
}

export function BreakTimePoliciesTable({ policies, onEdit, onDelete }: BreakTimePoliciesTableProps) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Duration</TableHeadCell>
                <TableHeadCell>Policy Rules</TableHeadCell>
                <TableHeadCell>Applicable Work Shifts</TableHeadCell>
                <TableHeadCell className="text-right">Action</TableHeadCell>
            </TableHeader>
            <TableBody>
                {policies.map((bt) => (
                    <TableRow key={bt.id} className="hover:bg-gray-50/70">
                        <TableCell className="font-semibold text-gray-900 text-xs">
                            {bt.name}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 font-medium">
                            {bt.durationHours}h {bt.durationMinutes}m
                        </TableCell>
                        <TableCell>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {bt.isPaid ? "Paid Break" : "Unpaid"} • Max {bt.maxPerShift}/shift
                            </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                            {bt.assignedShifts.join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onEdit(bt)}
                                    title="Edit Break Time"
                                >
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                    variant="destructive-ghost"
                                    size="icon-sm"
                                    onClick={() => onDelete(bt.id)}
                                    title="Delete Break Time"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}