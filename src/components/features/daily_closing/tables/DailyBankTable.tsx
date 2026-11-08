"use client";
import React, { memo } from "react";
import { DailyBankRecord } from "@/types/daily_closing";
import { Edit, Trash2, Landmark, SearchX, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

const BankRow = memo(({
    row, isSelected, onToggle, onEdit, onDelete
}: {
    row: DailyBankRecord, isSelected: boolean, onToggle: (id: string) => void, onEdit: (row: DailyBankRecord) => void, onDelete: (id: string) => void
}) => (
    <tr className={`transition-colors group ${row.status === "Reconciled" ? "bg-gray-50/50 hover:bg-gray-100/50" : "hover:bg-blue-50/30"}`}>
        <td className="p-3 text-center w-12">
            <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                checked={isSelected}
                onChange={() => onToggle(row.id)}
            />
        </td>
        <td className="p-3">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.transactionType === "Deposit" ? "bg-emerald-100 text-emerald-600" : row.transactionType === "Withdrawal" ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}>
                    <Landmark className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{row.bankAccount}</span>
                    <span className="text-xs text-gray-500 font-medium">Ref: {row.referenceNumber || "N/A"}</span>
                </div>
            </div>
        </td>
        <td className="p-3">
            <span className="text-sm font-bold text-gray-700">{row.transactionType}</span>
        </td>
        <td className="p-3">
            <span className={`text-sm font-black ${row.transactionType === "Deposit" ? "text-emerald-600" : "text-gray-900"}`}>
                {row.transactionType === "Deposit" ? "+" : ""}{row.amount.toLocaleString()} BDT
            </span>
        </td>
        <td className="p-3">
            {row.status === "Reconciled" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3" /> Reconciled</span>
            ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>
            )}
        </td>
        <td className="p-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row)} disabled={row.status === "Reconciled"}>
                    <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.id)} disabled={row.status === "Reconciled"}>
                    <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-700" />
                </Button>
            </div>
        </td>
    </tr>
));
BankRow.displayName = "BankRow";

export function DailyBankTable({ manager }: { manager: any }) {
    const data = manager.paginatedData as DailyBankRecord[];

    // --- Safely routed bulk actions using the global store ---
    const handleMassReconcile = () => {
        manager.store.markBankRecordsStatus(manager.selectedIds, "Reconciled");
        manager.setSelectedIds([]);
    };

    const handleMassDelete = () => {
        manager.store.deleteDailyBankRecords(manager.selectedIds);
        manager.setSelectedIds([]);
        manager.setCurrentPage(1); // GC Pagination
    };

    return (
        <div className="flex flex-col h-full relative">
            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="outline" size="sm" className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 h-8 text-xs font-bold" onClick={handleMassReconcile}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Mark Reconciled
                    </Button>
                    <Button variant="default" size="sm" className="bg-rose-500 hover:bg-rose-600 text-white h-8 text-xs font-bold" onClick={handleMassDelete}>
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                    </Button>
                </BulkActionBar>
            )}

            <div className="bg-white border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-sm rounded-xl">
                {data.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <SearchX className="w-8 h-8 text-gray-300 mb-3" />
                        <h3 className="text-sm font-black text-gray-900">No Bank Records</h3>
                        <p className="text-xs text-gray-500 mt-1">No banking transactions recorded for this date.</p>
                    </div>
                ) : (
                    <div className="w-full overflow-auto custom-scrollbar flex-1 relative">
                        <table className="w-full text-left border-collapse text-sm min-w-max">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 w-12 text-center">
                                        {/* FIXED: Reading activeTabData.length instead of processedData */}
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={manager.selectedIds.length === manager.activeTabData.length && manager.activeTabData.length > 0}
                                            onChange={() => manager.toggleSelection("ALL")}
                                        />
                                    </th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Bank Details</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row) => (
                                    <BankRow
                                        key={row.id}
                                        row={row}
                                        isSelected={manager.selectedIds.includes(row.id)}
                                        onToggle={manager.toggleSelection}
                                        onEdit={(r) => { manager.setActiveRecord(r); manager.setDrawerMode("bank_form"); }}
                                        onDelete={(id) => { manager.store.deleteDailyBankRecords([id]); }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end shrink-0">

                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Page {manager.currentPage} of {Math.max(1, Math.ceil(manager.activeTabData.length / manager.perPage))}
                    </div>
                </div>
            </div>
        </div>
    );
}