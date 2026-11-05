"use client";
import { useState } from "react";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { UploadCloud, CheckCircle, AlertTriangle, XCircle, FileText, Search } from "lucide-react";

export function ReconciliationDashboard({ manager }: { manager: ReturnType<typeof useLedgerManager> }) {
    const [isUploaded, setIsUploaded] = useState(false);

    // Simulated parsing of a Bank CSV for UI demonstration
    const simulatedReconciliation = [
        { id: "B1", date: "2026-11-05", desc: "Salamat Innovation Transfer", bankAmount: 39500, systemAmount: 39500, status: "Matched" },
        { id: "B2", date: "2026-11-04", desc: "Monthly Server Hosting", bankAmount: -4500, systemAmount: -4500, status: "Matched" },
        { id: "B3", date: "2026-11-04", desc: "Office Supplies Vendor", bankAmount: -12000, systemAmount: -10000, status: "Mismatch" },
        { id: "B4", date: "2026-11-03", desc: "Unknown Cash Deposit", bankAmount: 5000, systemAmount: null, status: "Missing" },
    ];

    if (!isUploaded) {
        return (
            <div className="flex-1 erp-card flex flex-col items-center justify-center bg-white p-10 shadow-sm min-h-[500px]">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-brand-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Bank Statement</h2>
                <p className="text-sm text-gray-500 max-w-md text-center mb-6">
                    Drag and drop your bank exported CSV file here. The system will automatically compare your bank records against the Master Journal.
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl w-full max-w-lg p-10 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-gray-50 transition cursor-pointer" onClick={() => setIsUploaded(true)}>
                    <FileText className="w-10 h-10 text-gray-400 mb-3" />
                    <span className="text-sm font-bold text-gray-700">Click to Browse Files</span>
                    <span className="text-xs text-gray-400 mt-1">Supports .CSV and .XLSX up to 5MB</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-2">

            {/* KPI Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Statement Period</p>
                    <p className="text-lg font-black mt-1 text-gray-900">Nov 1 - Nov 5, 2026</p>
                </div>
                <div className="bg-emerald-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Perfect Matches</p>
                    <p className="text-2xl font-black mt-1">2</p>
                </div>
                <div className="bg-amber-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Amount Mismatches</p>
                    <p className="text-2xl font-black mt-1">1</p>
                </div>
                <div className="bg-rose-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Missing in System</p>
                    <p className="text-2xl font-black mt-1">1</p>
                </div>
            </div>

            {/* Reconciliation Table */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 text-sm">Discrepancy Report</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsUploaded(false)}>Cancel</Button>
                        <Button variant="default" size="sm"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Reconcile Matches</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto min-h-[400px]">
                    <Table containerClassName="w-full">
                        <TableHeader>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Bank Description</TableHeadCell>
                            <TableHeadCell className="text-right">Bank Amount</TableHeadCell>
                            <TableHeadCell className="text-right">System Amount</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {simulatedReconciliation.map(row => (
                                <TableRow key={row.id} className="hover:bg-gray-50/70">
                                    <TableCell>
                                        <span className="font-bold text-gray-900 text-xs">{row.date}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-gray-700">{row.desc}</span>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs font-bold text-gray-900">
                                        ৳{Math.abs(row.bankAmount).toLocaleString()} {row.bankAmount > 0 ? '(Cr)' : '(Dr)'}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs font-bold">
                                        {row.systemAmount === null ? (
                                            <span className="text-gray-400 font-normal italic">Not Found</span>
                                        ) : (
                                            <span className={row.systemAmount === row.bankAmount ? 'text-gray-900' : 'text-rose-600'}>
                                                ৳{Math.abs(row.systemAmount).toLocaleString()} {row.systemAmount > 0 ? '(Cr)' : '(Dr)'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {row.status === "Matched" && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Matched</span>}
                                        {row.status === "Mismatch" && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Mismatch</span>}
                                        {row.status === "Missing" && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Missing</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {row.status !== "Matched" && (
                                                <Button variant="outline" size="sm" className="h-7 text-[9px] px-2" onClick={() => manager.setDrawerMode("transaction")}>
                                                    <Search className="w-3 h-3 mr-1" /> Investigate
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}