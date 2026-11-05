"use client";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Plus, Eye, Edit, Trash2, Printer, Paperclip, CheckCircle, Lock } from "lucide-react";

export function JournalDashboard({ manager }: { manager: ReturnType<typeof useLedgerManager> }) {

    const paginatedJournal = manager.globalJournal.slice((manager.currentPage - 1) * manager.perPage, manager.currentPage * manager.perPage);

    return (
        <div className="flex flex-col h-full gap-2">

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">

                {/* Header & Horizontal Quick-Filters */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/30">
                    <div className="flex justify-between items-center">
                        <input type="text" placeholder="Search REF or Check #..." className="erp-input w-64 bg-white" />
                        <Button variant="default" size="sm" className="h-8" onClick={() => manager.setDrawerMode("transaction")}><Plus className="w-3.5 h-3.5 mr-1" /> New Entry</Button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-full transition whitespace-nowrap">All Transactions</button>
                        <button className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full transition whitespace-nowrap">Pending Approval</button>
                        <button className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full transition whitespace-nowrap">Bounced Checks</button>
                    </div>
                </div>

                {/* CRITICAL: min-h-[400px] and pb-32 prevents CustomSelect from clipping */}
                <div className="flex-1 overflow-x-auto min-h-[400px] pb-32">
                    <Table containerClassName="w-full">
                        <TableHeader>
                            <TableHeadCell className="w-10 text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableHeadCell>
                            <TableHeadCell>Date & Ref</TableHeadCell>
                            <TableHeadCell>Transaction Details</TableHeadCell>
                            <TableHeadCell className="w-32">Status</TableHeadCell>
                            <TableHeadCell className="text-right">Debit / Credit</TableHeadCell>
                            <TableHeadCell className="text-right">Running Balance</TableHeadCell>
                            <TableHeadCell className="text-right">Actions</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {paginatedJournal.map(tx => {
                                const isLocked = manager.isRecordLocked(tx.date);
                                const isDebit = tx.type === "Debit";

                                return (
                                    <TableRow key={tx.id} className={`hover:bg-gray-50/70 group ${isLocked ? 'bg-gray-50/50' : ''}`}>
                                        <TableCell className="text-center w-10">
                                            {isLocked ? <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" /> : <input type="checkbox" className="rounded text-brand-primary" />}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-gray-900 text-xs whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</span>
                                            <p className="text-[10px] font-mono text-gray-500 mt-0.5">{tx.referenceNumber || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-gray-800 text-xs">{tx.lineItems[0]?.description || 'Ledger Entry'}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{tx.paymentMethod}</span>
                                                {tx.attachments.length > 0 && <span title="View Receipt" className="cursor-pointer text-brand-primary hover:text-brand-dark"><Paperclip className="w-3 h-3" /></span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-32">
                                            {/* Inline Dropdown for Status Control */}
                                            <CustomSelect
                                                size="sm"
                                                value={tx.status}
                                                options={["Pending", "Cleared", "Bounced"]}
                                                disabled={isLocked}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`text-xs font-black ${isDebit ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {isDebit ? '+' : '-'} ৳{tx.totalAmount.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-xs font-bold text-gray-700">৳{tx.computedRunningBalance.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                {/* Maker-Checker Inline Approval */}
                                                {tx.status === "Pending" && !isLocked && (
                                                    <Button variant="ghost" size="icon-sm" className="text-emerald-600 hover:bg-emerald-50">
                                                        <span title="Approve Entry"><CheckCircle className="w-3.5 h-3.5" /></span>
                                                    </Button>
                                                )}

                                                <Button variant="ghost" size="icon-sm">
                                                    <span title="Print Receipt"><Printer className="w-3.5 h-3.5 text-gray-600" /></span>
                                                </Button>
                                                <Button variant="ghost" size="icon-sm">
                                                    <span title="View Audit Trail"><Eye className="w-3.5 h-3.5 text-blue-600" /></span>
                                                </Button>

                                                {/* Disables Edit/Delete if the accounting period is locked */}
                                                <Button variant="ghost" size="icon-sm" disabled={isLocked}><Edit className={`w-3.5 h-3.5 ${isLocked ? 'text-gray-300' : 'text-gray-600'}`} /></Button>
                                                <Button variant="destructive-ghost" size="icon-sm" disabled={isLocked}><Trash2 className={`w-3.5 h-3.5 ${isLocked ? 'text-gray-300' : ''}`} /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-gray-100 bg-white">
                    <Pagination currentPage={manager.currentPage} totalPages={Math.max(1, Math.ceil(manager.globalJournal.length / manager.perPage))} perPage={manager.perPage} onPageChange={manager.setCurrentPage} onPerPageChange={(v) => { manager.setPerPage(v); manager.setCurrentPage(1); }} />
                </div>
            </div>
        </div>
    );
}