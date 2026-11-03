"use client";
import { LiveBreakSession } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface BreakTimeLiveTableProps {
    liveBreaks: LiveBreakSession[];
    onEndBreak: (id: string, employeeName: string, elapsedMinutes: number) => void;
}

export function BreakTimeLiveTable({ liveBreaks, onEndBreak }: BreakTimeLiveTableProps) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell>Employee</TableHeadCell>
                <TableHeadCell>Outlet</TableHeadCell>
                <TableHeadCell>Break Policy</TableHeadCell>
                <TableHeadCell>Started At</TableHeadCell>
                <TableHeadCell>Elapsed vs Policy Limit</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-right">Action</TableHeadCell>
            </TableHeader>
            <TableBody>
                {liveBreaks.map((lb) => {
                    const isExceeded = lb.status === "Exceeded";
                    return (
                        <TableRow key={lb.id} className={isExceeded ? "bg-rose-50/60" : "hover:bg-gray-50"}>
                            <TableCell>
                                <div className="font-semibold text-gray-900 text-xs">
                                    {lb.employeeName}
                                </div>
                                <div className="text-[10px] text-gray-400">{lb.empCode}</div>
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">{lb.outlet}</TableCell>
                            <TableCell className="text-xs font-medium text-gray-800">
                                {lb.breakName}
                            </TableCell>
                            <TableCell className="text-xs font-mono">{lb.startTime}</TableCell>
                            <TableCell>
                                <span className={`font-mono text-xs font-bold ${isExceeded ? "text-rose-600" : "text-gray-800"}`}>
                                    {lb.elapsedMinutes}m / {lb.allowedMinutes}m
                                </span>
                            </TableCell>
                            <TableCell>
                                {isExceeded ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                        <AlertTriangle className="w-3 h-3" /> Exceeded (+{lb.elapsedMinutes - lb.allowedMinutes}m)
                                    </span>
                                ) : lb.status === "Active" ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        <Clock className="w-3 h-3" /> On Break
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3" /> Completed & Synced
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {lb.status !== "Completed" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => onEndBreak(lb.id, lb.employeeName, lb.elapsedMinutes)}
                                    >
                                        Complete & Sync
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}