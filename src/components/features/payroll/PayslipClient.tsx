"use client";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGlobalPayrollStore } from "@/store/useGlobalPayrollStore";
import { PayslipItem } from "@/types/payroll.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { PrintablePayslip } from "./PrintablePayslip";
import { Printer, Eye, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

export function PayslipClient() {
    const store = useGlobalPayrollStore();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewTarget, setViewTarget] = useState<PayslipItem | null>(null);
    const [printTarget, setPrintTarget] = useState<PayslipItem | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Payslip_${printTarget?.employeeName || "Doc"}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } * { border-color: #e5e7eb !important; } }",
        onAfterPrint: () => setPrintTarget(null)
    });

    const triggerPrint = (ps: PayslipItem) => {
        setPrintTarget(ps);
        setTimeout(handlePrint, 100);
    };

    const handleBulkAction = (action: "Pay" | "Email") => {
        toast.success(`Bulk ${action === "Pay" ? "Marked as Paid" : "Emailed"} for ${selectedIds.length} payslips.`);
        setSelectedIds([]);
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Payslips</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Command center for payouts, ledgers, and document printing.</p>
                </div>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <Table containerClassName="flex-1 min-h-[380px]">
                    <TableHeader>
                        <TableHeadCell className="w-10">
                            <input type="checkbox" className="rounded border-gray-300 text-brand-primary" checked={store.payslips.length > 0 && selectedIds.length === store.payslips.length} onChange={e => setSelectedIds(e.target.checked ? store.payslips.map(p => p.id) : [])} />
                        </TableHeadCell>
                        <TableHeadCell>Employee</TableHeadCell>
                        <TableHeadCell className="text-right">Basic Salary</TableHeadCell>
                        <TableHeadCell className="text-right">Net Payable</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {store.payslips.map(ps => (
                            <TableRow key={ps.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary" checked={selectedIds.includes(ps.id)} onChange={() => setSelectedIds(prev => prev.includes(ps.id) ? prev.filter(i => i !== ps.id) : [...prev, ps.id])} />
                                </TableCell>
                                <TableCell className="font-bold text-xs">{ps.employeeName}</TableCell>
                                <TableCell className="text-right font-mono text-xs text-gray-600">৳ {ps.basicSalary.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono text-xs font-bold text-gray-900">৳ {ps.netSalary.toLocaleString()}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ps.status === "Draft" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{ps.status}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon-sm" onClick={() => setViewTarget(ps)}><Eye className="w-4 h-4 text-blue-600" /></Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => triggerPrint(ps)}><Printer className="w-4 h-4 text-gray-700" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedIds.length > 0 && (
                <BulkActionBar selectedCount={selectedIds.length} onClearSelection={() => setSelectedIds([])}>
                    <Button variant="default" size="sm" onClick={() => handleBulkAction("Pay")}><CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Paid</Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("Email")}><Mail className="w-4 h-4 mr-1.5" /> Bulk Email PDF</Button>
                </BulkActionBar>
            )}

            {/* Read-Only Ledger Drawer */}
            <Drawer title={`Ledger Preview - ${viewTarget?.employeeName || ""}`} isOpen={!!viewTarget} onClose={() => setViewTarget(null)} width="drawer-full-content">
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded overflow-hidden">
                        <div className="border-r border-gray-200">
                            <div className="bg-emerald-50 p-2 text-[10px] font-bold uppercase text-emerald-800 text-center border-b border-emerald-200">Earnings</div>
                            <div className="p-4 flex flex-col gap-2">
                                {viewTarget?.allowances.map((a, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-700"><span>{a.name}</span><span className="font-mono font-medium text-emerald-700">৳{a.amount}</span></div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="bg-rose-50 p-2 text-[10px] font-bold uppercase text-rose-800 text-center border-b border-rose-200">Deductions</div>
                            <div className="p-4 flex flex-col gap-2">
                                {viewTarget?.deductions.map((d, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-700"><span>{d.name}</span><span className="font-mono font-medium text-rose-700">৳{d.amount}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            {/* Isolated Hidden Print Layer */}
            <div className="hidden"><PrintablePayslip ref={printRef} payslip={printTarget} /></div>
        </div>
    );
}