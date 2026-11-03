"use client";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Clock, Edit, Trash2 } from "lucide-react";

interface ShiftTemplatesTableProps {
    workShifts: WorkShiftTemplate[];
    employeeShiftMap: Record<string, string>;
    onEdit: (shift: WorkShiftTemplate) => void;
    onDelete: (id: string) => void;
}

export function ShiftTemplatesTable({ workShifts, employeeShiftMap, onEdit, onDelete }: ShiftTemplatesTableProps) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell>Shift Name</TableHeadCell>
                <TableHeadCell>Timing</TableHeadCell>
                <TableHeadCell>Grace Period</TableHeadCell>
                <TableHeadCell>Half / Full Day</TableHeadCell>
                <TableHeadCell>Weekly Off-Days</TableHeadCell>
                <TableHeadCell>Assigned Staff</TableHeadCell>
                <TableHeadCell className="text-right">Action</TableHeadCell>
            </TableHeader>
            <TableBody>
                {workShifts.map((ws) => (
                    <TableRow key={ws.id} className="hover:bg-gray-50">
                        <TableCell>
                            <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-brand-primary" /> {ws.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">{ws.code}</div>
                        </TableCell>
                        <TableCell className="text-xs font-mono font-semibold text-gray-800">
                            {ws.startTime} – {ws.endTime}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                            {ws.graceMinutes} mins
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                            {ws.halfDayHours}h / {ws.fullDayHours}h
                        </TableCell>
                        <TableCell>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {ws.weekends.join(", ")}
                            </span>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-brand-primary">
                            {Object.values(employeeShiftMap).filter((s) => s === ws.name).length} Employees
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(ws)}>
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(ws.id)}>
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