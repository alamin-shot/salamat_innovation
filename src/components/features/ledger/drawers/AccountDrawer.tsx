"use client";
import { useMemo, useRef } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Printer, Plus, Eye, Phone, Mail, TrendingUp, TrendingDown } from "lucide-react";
import { useLedgerManager } from "@/hooks/ledger_hooks/useLedgerManager";
import { useReactToPrint } from "react-to-print";
import { PrintableStatement } from "../print/PrintableStatement";
import { useGlobalLedgerStore } from "@/store/useGlobalLedgerStore";

export function AccountDrawer({ manager }: { manager: ReturnType<typeof useLedgerManager> }) {
    const isOpen = manager.drawerMode === "account";
    const account = manager.activeRecord;
    const store = useGlobalLedgerStore();

    // 1. Isolate and Calculate Running Balance specifically for this Account
    const accountTransactions = useMemo(() => {
        if (!account) return [];

        // Get raw transactions for this account and sort oldest to newest
        const rawTx = store.transactions
            .filter(t => t.accountId === account.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let running = account.openingBalance || 0;

        const mapped = rawTx.map(tx => {
            if (tx.status !== "Bounced" && tx.status !== "Pending") {
                if (tx.type === "Credit") running += tx.totalAmount;
                if (tx.type === "Debit") running -= tx.totalAmount;
            }
            // Overriding the global computed balance with the isolated account balance
            return { ...tx, computedRunningBalance: running };
        });

        // Reverse for the UI so newest is at the top
        return mapped.reverse();
    }, [account, store.transactions]);

    // 2. The Universal Print Engine Hook
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Ledger_Statement_${account?.name?.replace(/\s+/g, '_') || 'Export'}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } * { border-color: #d1d5db !important; } }"
    });

    if (!account) return null;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => manager.setDrawerMode("none")}
            title="Account Ledger Statement"
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full bg-gray-50/50 p-4 gap-2 overflow-y-auto custom-scrollbar">

                {/* Top Action & KPI Bar */}
                <div className="flex flex-col xl:flex-row gap-2">

                    {/* Account Identity Card */}
                    <div className="erp-card p-4 flex-1 bg-white flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 block">Entity Details</span>
                                <h2 className="text-lg font-bold text-gray-900">{account.name}</h2>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {account.phone}</span>
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {account.email}</span>
                                </div>
                            </div>
                            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase px-2 py-1 rounded">
                                {account.type}
                            </span>
                        </div>
                    </div>

                    {/* Balance KPI */}
                    <div className={`erp-card p-4 w-full xl:w-72 text-white flex flex-col justify-center ${account.computedBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-80 flex items-center gap-1">
                            {account.computedBalance >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            Current Balance
                        </span>
                        <p className="text-3xl font-black mt-1">
                            ৳ {Math.abs(account.computedBalance).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold opacity-80 mt-1">
                            {account.computedBalance >= 0 ? 'Account is in Debit (Receivable)' : 'Account is in Credit (Payable)'}
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm mt-2">
                    <div className="flex gap-2">
                        {account.aging?.overdue30 > 0 && <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded">30d Overdue: ৳{account.aging.overdue30.toLocaleString()}</span>}
                        {account.aging?.overdue90 > 0 && <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-1 rounded">90d+ Overdue: ৳{account.aging.overdue90.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePrint()} className="h-8 border-gray-200 shadow-2xs">
                            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print A4 Statement
                        </Button>
                        <Button variant="default" size="sm" className="h-8 shadow-2xs" onClick={() => {
                            // Close this drawer and open the transaction creator for this account
                            manager.setDrawerMode("transaction");
                            // Note: You would normally pre-fill the transaction drawer's accountId state here
                        }}>
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Entry
                        </Button>
                    </div>
                </div>

                {/* Isolated Account Journal Table */}
                <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm mt-2 min-h-[400px]">
                    <div className="flex-1 overflow-x-auto">
                        <Table containerClassName="w-full">
                            <TableHeader>
                                <TableHeadCell>Date & Ref</TableHeadCell>
                                <TableHeadCell>Particulars</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell className="text-right">Debit (৳)</TableHeadCell>
                                <TableHeadCell className="text-right">Credit (৳)</TableHeadCell>
                                <TableHeadCell className="text-right">Balance</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                {accountTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-xs">No transactions recorded for this account.</TableCell>
                                    </TableRow>
                                ) : (
                                    accountTransactions.map(tx => {
                                        const isDebit = tx.type === "Debit";
                                        return (
                                            <TableRow key={tx.id} className="hover:bg-gray-50/70 group">
                                                <TableCell>
                                                    <span className="font-bold text-gray-900 text-xs whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</span>
                                                    <p className="text-[10px] font-mono text-gray-500 mt-0.5">{tx.referenceNumber || 'N/A'}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-gray-800 text-xs">{tx.lineItems[0]?.description || 'Ledger Entry'}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tx.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {tx.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-xs">
                                                    {isDebit ? tx.totalAmount.toLocaleString() : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-xs">
                                                    {!isDebit ? tx.totalAmount.toLocaleString() : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="text-xs font-bold text-gray-900">৳{tx.computedRunningBalance.toLocaleString()}</span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* THE HIDDEN PAPER COMPONENT (Injected for printing only) */}
                <PrintableStatement
                    ref={printRef}
                    account={account}
                    transactions={accountTransactions}
                />

            </div>
        </Drawer>
    );
}