"use client";
import React, { forwardRef } from "react";

interface PrintableStatementProps {
    account: { name: string; phone: string; email: string; computedBalance: number } | null;
    transactions: any[];
}

export const PrintableStatement = forwardRef<HTMLDivElement, PrintableStatementProps>(({ account, transactions }, ref) => {
    if (!account) return null;

    return (
        <div className="hidden">
            {/* 
                CRITICAL PRINT WRAPPER: 
                Forces exact physical A4 dimensions and isolates from Tailwind screen rules.
            */}
            <div ref={ref} className="bg-white p-8" style={{ width: '210mm', minHeight: '297mm', color: '#000' }}>

                {/* Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900">Salamat Innovation</h1>
                        <p className="text-xs text-gray-600 mt-1">Corporate Ledger Statement</p>
                    </div>
                    <div className="text-right text-xs text-gray-600 flex flex-col gap-0.5">
                        <p>Date Printed: {new Date().toLocaleDateString()}</p>
                        <p>Generated via ERP System</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="flex justify-between items-end mb-8 bg-gray-50 p-4 border border-gray-200 rounded-sm">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Statement For</p>
                        <h2 className="text-lg font-bold text-gray-900">{account.name}</h2>
                        <p className="text-xs text-gray-600 mt-0.5">{account.phone} | {account.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Current Balance</p>
                        <p className={`text-xl font-black ${account.computedBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            ৳ {Math.abs(account.computedBalance).toLocaleString()} {account.computedBalance >= 0 ? 'Dr' : 'Cr'}
                        </p>
                    </div>
                </div>

                {/* Master Journal Table (Strict Print Borders) */}
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-900 uppercase tracking-wider text-[9px] font-bold">
                            <th className="p-2 border border-gray-300">Date</th>
                            <th className="p-2 border border-gray-300">Particulars / Ref</th>
                            <th className="p-2 border border-gray-300 text-right">Debit (৳)</th>
                            <th className="p-2 border border-gray-300 text-right">Credit (৳)</th>
                            <th className="p-2 border border-gray-300 text-right">Balance (৳)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500 border border-gray-300">No transactions recorded.</td></tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="text-gray-800">
                                    <td className="p-2 border border-gray-300 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="p-2 border border-gray-300">
                                        <span className="font-bold">{tx.lineItems?.[0]?.description || 'Ledger Entry'}</span>
                                        {tx.referenceNumber && <span className="block text-[9px] text-gray-500 mt-0.5">Ref: {tx.referenceNumber}</span>}
                                    </td>
                                    <td className="p-2 border border-gray-300 text-right font-mono">{tx.type === 'Debit' ? tx.totalAmount.toLocaleString() : '-'}</td>
                                    <td className="p-2 border border-gray-300 text-right font-mono">{tx.type === 'Credit' ? tx.totalAmount.toLocaleString() : '-'}</td>
                                    <td className="p-2 border border-gray-300 text-right font-bold font-mono">{tx.computedRunningBalance.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Footer Signatures */}
                <div className="mt-20 pt-10 flex justify-between items-center text-xs font-bold text-gray-400">
                    <div className="w-48 text-center border-t border-gray-400 pt-2">Authorized Signature</div>
                    <div className="w-48 text-center border-t border-gray-400 pt-2">Client Acknowledgment</div>
                </div>

            </div>
        </div>
    );
});
PrintableStatement.displayName = "PrintableStatement";