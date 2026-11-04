"use client";
import { LeaveTypeItem } from "@/types/leaves.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Edit, Trash2, FileSearch } from "lucide-react";

interface LeaveTypeTableProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    paginated: LeaveTypeItem[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    currentPage: number;
    totalPages: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
}

export function LeaveTypeTable({
    searchQuery, setSearchQuery, paginated, onEdit, onDelete,
    currentPage, totalPages, perPage, onPageChange, onPerPageChange
}: LeaveTypeTableProps) {
    return (
        <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search leave types..."
                    className="erp-input max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Table containerClassName="flex-1 min-h-[380px]">
                <TableHeader>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Day (Quota)</TableHeadCell>
                    <TableHeadCell>Policy Rules</TableHeadCell>
                    <TableHeadCell>Enable</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {paginated.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-20 text-gray-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FileSearch className="w-12 h-12 text-gray-300" />
                                    <span className="text-xs font-medium">No Leave Types found</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginated.map((lt) => (
                            <TableRow key={lt.id} className="hover:bg-gray-50/80">
                                <TableCell className="font-semibold text-gray-900 text-xs">
                                    {lt.name}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${lt.type === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                        }`}>
                                        {lt.type}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs text-gray-700 font-mono">
                                    {lt.days.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {lt.carryForward && <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">Carry Forward</span>}
                                        {lt.prorate && <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">Pro-Rated</span>}
                                        {!lt.carryForward && !lt.prorate && <span className="text-xs text-gray-400">—</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${lt.status === "Enabled" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                                        }`}>
                                        {lt.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(lt.id)} title="Edit Leave Type">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(lt.id)} title="Delete Leave Type">
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
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                />
            </div>
        </div>
    );
}