"use client";
import { forwardRef } from "react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { useGlobalClosingStore } from "@/store/useGlobalClosingStore";

interface PrintProps {
    manager: ReturnType<typeof useClosingManager>;
}

export const MasterZReportPrint = forwardRef<HTMLDivElement, PrintProps>(({ manager }, ref) => {
    const store = useGlobalClosingStore();
    const { activeDate, expectedMath, dayState, discrepancies } = manager;

    // Helper to calculate total value for a specific ledger
    const getLedgerTotal = (arr: any[]) => arr.filter(t => t.date === activeDate).reduce((sum, t) => sum + t.paidAmount, 0);

    return (
        <div className="hidden">
            {/* STRICT PHYSICAL DIMENSIONS FOR A4 */}
            <div ref={ref} className="bg-white text-black p-10 w-[210mm] min-h-[297mm] mx-auto text-[12px] leading-relaxed">

                {/* Header */}
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-2xl font-black uppercase tracking-widest">Salamat Innovation</h1>
                    <h2 className="text-lg font-bold text-gray-700 mt-1">End of Day (EOD) Z-Report</h2>
                    <p className="text-sm font-medium mt-1">Closing Date: <span className="font-black">{activeDate}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Status: {dayState.status.toUpperCase()}</p>
                </div>

                {/* 1. Master Tender Reconciliation */}
                <h3 className="font-black uppercase border-b border-gray-300 mb-3 pb-1">1. Tender Reconciliation</h3>
                <table className="w-full text-left border-collapse mb-8">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-300 font-bold">Payment Method</th>
                            <th className="p-2 border border-gray-300 font-bold text-right">System Expected</th>
                            <th className="p-2 border border-gray-300 font-bold text-right">Actual Count</th>
                            <th className="p-2 border border-gray-300 font-bold text-right">Discrepancy (Over/Short)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(["cash", "bkash", "pos"] as const).map(tender => {
                            const expected = expectedMath[tender];
                            const actual = dayState.actualTenders[tender];
                            const diff = discrepancies[tender];
                            return (
                                <tr key={tender}>
                                    <td className="p-2 border border-gray-300 uppercase">{tender}</td>
                                    <td className="p-2 border border-gray-300 text-right">{expected.toLocaleString()}</td>
                                    <td className="p-2 border border-gray-300 text-right font-bold">{actual.toLocaleString()}</td>
                                    <td className={`p-2 border border-gray-300 text-right font-black ${diff !== 0 ? 'text-rose-600' : ''}`}>
                                        {diff.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* 2. Ledger Summary */}
                <h3 className="font-black uppercase border-b border-gray-300 mb-3 pb-1">2. Ledger Activity Summary</h3>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="font-bold underline mb-2">Inflows (+)</h4>
                        <div className="flex justify-between mb-1"><span>Sales Revenue:</span> <span>{getLedgerTotal(store.sales).toLocaleString()}</span></div>
                        <div className="flex justify-between mb-1"><span>Deposits:</span> <span>{getLedgerTotal(store.deposits).toLocaleString()}</span></div>
                    </div>
                    <div>
                        <h4 className="font-bold underline mb-2">Outflows (-)</h4>
                        <div className="flex justify-between mb-1"><span>Purchases:</span> <span>{getLedgerTotal(store.purchases).toLocaleString()}</span></div>
                        <div className="flex justify-between mb-1"><span>Expenses:</span> <span>{getLedgerTotal(store.expenses).toLocaleString()}</span></div>
                        <div className="flex justify-between mb-1"><span>Withdrawals:</span> <span>{getLedgerTotal(store.withdrawals).toLocaleString()}</span></div>
                        <div className="flex justify-between mb-1"><span>Refunds:</span> <span>{getLedgerTotal(store.salesReturns).toLocaleString()}</span></div>
                    </div>
                </div>

                {/* 3. Cash Denominations Audit (If Applicable) */}
                <h3 className="font-black uppercase border-b border-gray-300 mb-3 pb-1">3. Cash Denomination Tally</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mb-12">
                    {Object.entries(dayState.denominations).reverse().map(([note, count]) => {
                        if (count === 0) return null;
                        return (
                            <div key={note} className="flex gap-2 w-32">
                                <span className="font-bold">৳{note}</span> x {count} = <span>{(Number(note) * count).toLocaleString()}</span>
                            </div>
                        );
                    })}
                </div>

                {/* 4. Maker-Checker Signatures */}
                <div className="flex justify-between mt-20 pt-8 border-t border-gray-300">
                    <div className="text-center w-48">
                        <div className="border-b border-black h-8 mb-2"></div>
                        <p className="font-bold">Prepared By</p>
                        <p className="text-xs mt-1">{dayState.preparedBy || "Not Submitted"}</p>
                    </div>
                    <div className="text-center w-48">
                        <div className="border-b border-black h-8 mb-2"></div>
                        <p className="font-bold">Approved By</p>
                        <p className="text-xs mt-1">{dayState.approvedBy || "Not Approved"}</p>
                    </div>
                </div>

                <div className="text-center mt-12 text-[10px] text-gray-500">
                    Generated securely by Salamat Innovation ERP System • Document is cryptographically locked if EOD status is APPROVED.
                </div>
            </div>
        </div>
    );
});
MasterZReportPrint.displayName = "MasterZReportPrint";