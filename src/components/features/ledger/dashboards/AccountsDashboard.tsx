"use client";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Plus, Eye, Edit, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

export function AccountsDashboard({ manager }: { manager: ReturnType<typeof useLedgerManager> }) {

    // Calculate global AR/AP for KPI Ribbon
    const totalReceivable = manager.accountsWithAging.filter(a => a.computedBalance > 0).reduce((acc, a) => acc + a.computedBalance, 0);
    const totalPayable = manager.accountsWithAging.filter(a => a.computedBalance < 0).reduce((acc, a) => acc + Math.abs(a.computedBalance), 0);
    const totalOverdue = manager.accountsWithAging.reduce((acc, a) => acc + a.aging.overdue30 + a.aging.overdue60 + a.aging.overdue90, 0);

    // Pagination Slice
    const paginatedAccounts = manager.accountsWithAging.slice((manager.currentPage - 1) * manager.perPage, manager.currentPage * manager.perPage);

    return (
        <div className="flex flex-col h-full gap-2">
            {/* KPI Analytics Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-emerald-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Accounts Receivable</p>
                    <p className="text-2xl font-black mt-1">৳ {totalReceivable.toLocaleString()}</p>
                </div>
                <div className="bg-rose-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Accounts Payable</p>
                    <p className="text-2xl font-black mt-1">৳ {totalPayable.toLocaleString()}</p>
                </div>
                <div className="bg-amber-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Total Overdue (30 Days)</p>
                    <p className="text-2xl font-black mt-1">৳ {totalOverdue.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <input type="text" placeholder="Search accounts..." className="erp-input w-64 bg-white" />
                    <Button variant="default" size="sm" className="h-8"><Plus className="w-3.5 h-3.5 mr-1" /> New Account</Button>
                </div>

                <div className="flex-1 overflow-x-auto min-h-[400px] pb-10">
                    <Table containerClassName="w-full">
                        <TableHeader>
                            <TableHeadCell className="w-10 text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableHeadCell>
                            <TableHeadCell>Account Details</TableHeadCell>
                            <TableHeadCell>Current Balance</TableHeadCell>
                            <TableHeadCell>Aging (Overdue)</TableHeadCell>
                            <TableHeadCell className="text-right">Actions</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {paginatedAccounts.map(account => (
                                <TableRow key={account.id} className="hover:bg-gray-50/70 group">
                                    <TableCell className="text-center w-10"><input type="checkbox" className="rounded text-brand-primary" /></TableCell>
                                    <TableCell>
                                        <span className="font-bold text-gray-900 text-xs">{account.name}</span>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{account.phone} | {account.email}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-black ${account.computedBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            ৳ {Math.abs(account.computedBalance).toLocaleString()} {account.computedBalance >= 0 ? '(Dr)' : '(Cr)'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {account.aging.overdue30 > 0 && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">30d: ৳{account.aging.overdue30}</span>}
                                            {account.aging.overdue60 > 0 && <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">60d: ৳{account.aging.overdue60}</span>}
                                            {account.aging.overdue90 > 0 && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">90d+: ৳{account.aging.overdue90}</span>}
                                            {(account.aging.overdue30 + account.aging.overdue60 + account.aging.overdue90 === 0) && <span className="text-[9px] text-gray-400 font-medium">No Overdue</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="sm" className="h-7 text-[9px] px-2" onClick={() => { manager.setActiveRecord(account); manager.setDrawerMode("account"); }}><Eye className="w-3 h-3 mr-1" /> View Ledger</Button>
                                            <Button variant="ghost" size="icon-sm"><Edit className="w-3.5 h-3.5 text-gray-600" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-gray-100 bg-white">
                    <Pagination currentPage={manager.currentPage} totalPages={Math.max(1, Math.ceil(manager.accountsWithAging.length / manager.perPage))} perPage={manager.perPage} onPageChange={manager.setCurrentPage} onPerPageChange={(v) => { manager.setPerPage(v); manager.setCurrentPage(1); }} />
                </div>
            </div>
        </div>
    );
}