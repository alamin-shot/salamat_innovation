"use client";
import { useBreakTimeManager } from "@/hooks/attendance_hooks/useBreakTimeManager";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Trash2, Plus } from "lucide-react";
import { BreakTimeDrawer } from "./drawers/BreakTimeDrawer";

export function BreakTimeClient() {
    const manager = useBreakTimeManager();

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Break Time</h1>
                <Button variant="default" onClick={manager.openAddDrawer} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Break Time
                </Button>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <Table containerClassName="flex-1 min-h-[350px]">
                    <TableHeader>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Duration</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.breakTimes.length === 0 ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-12 text-gray-400">No break times configured.</TableCell></TableRow>
                        ) : (
                            manager.breakTimes.map(bt => (
                                <TableRow key={bt.id} className="group hover:bg-gray-50">
                                    <TableCell className="font-semibold text-gray-900">{bt.name}</TableCell>
                                    <TableCell className="text-gray-700">{bt.durationHours}h {bt.durationMinutes}m</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(bt.id)}><Edit className="w-4 h-4 text-gray-600" /></Button>
                                            <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(bt.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <BreakTimeDrawer manager={manager} />
        </div>
    );
}