"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Eye, Printer } from "lucide-react";
import { PayslipItem } from "@/types/payroll.types";

interface PayslipTableProps {
    payslips: PayslipItem[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: (checked: boolean) => void;
    onView: (ps: PayslipItem) => void;
    onPrint: (ps: PayslipItem) => void;
}

export function PayslipTable({ payslips, selectedIds, onToggleSelect, onToggleSelectAll, onView, onPrint }: PayslipTableProps) {
    return (
        <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
            <Table containerClassName="flex-1 min-h-[380px]">
                <TableHeader>
                    <TableHeadCell className="w-10">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-brand-primary"
                            checked={payslips.length > 0 && selectedIds.length === payslips.length}
                            onChange={(e) => onToggleSelectAll(e.target.checked)}
                        />
                    </TableHeadCell>
                    <TableHeadCell>Employee</TableHeadCell>
                    <TableHeadCell className="text-right">Basic Salary</TableHeadCell>
                    <TableHeadCell className="text-right">Net Payable</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {payslips.map((ps) => (
                        <TableRow key={ps.id} className="hover:bg-gray-50">
                            <TableCell>
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-brand-primary"
                                    checked={selectedIds.includes(ps.id)}
                                    onChange={() => onToggleSelect(ps.id)}
                                />
                            </TableCell>
                            <TableCell className="font-bold text-xs text-gray-900">{ps.employeeName}</TableCell>
                            <TableCell className="text-right font-mono text-xs text-gray-600">৳ {ps.basicSalary.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono text-xs font-bold text-gray-900">৳ {ps.netSalary.toLocaleString()}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ps.status === "Draft" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                    }`}>
                                    {ps.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon-sm" onClick={() => onView(ps)} title="Preview Ledger">
                                        <Eye className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" onClick={() => onPrint(ps)} title="Print Document">
                                        <Printer className="w-4 h-4 text-gray-700" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}