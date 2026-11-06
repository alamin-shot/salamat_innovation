"use client";
import { useMemo } from "react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { getClosingColumns } from "@/hooks/daily_closing_hooks/closingColumnFactory";
import { Eye, Edit, Trash2, FileX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { CustomSelect } from "@/components/ui/CustomSelect";


export function ClosingMasterTable({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const columns = useMemo(() => getClosingColumns(manager.activeTab), [manager.activeTab]);
    const { paginatedData, isLocked, isSubmitted } = manager;

    // If the day is locked or submitted, we completely strip edit/delete permissions
    const isReadOnly = isLocked || isSubmitted;

    // Sticky Aggregate Math
    const totals = useMemo(() => {
        return manager.activeTabData.reduce((acc, row) => ({
            total: acc.total + row.total,
            paid: acc.paid + row.paidAmount,
            due: acc.due + row.dueAmount
        }), { total: 0, paid: 0, due: 0 });
    }, [manager.activeTabData]);

    if (paginatedData.length === 0) {
        return (
            <div className="erp-card bg-white p-8 flex flex-col items-center justify-center border border-gray-200 text-center min-h-[350px]">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <FileX className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No records found</h3>
                <p className="text-sm text-gray-500 mt-1">There is no {manager.activeTab.replace("_", " ")} data for {manager.activeDate}.</p>
            </div>
        );
    }

    return (
        <div className="erp-card bg-white border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-sm">

            {/* 
                CRITICAL FIX: min-h-[350px] and pb-32 allows CustomSelect 
                dropdowns to open downwards without getting clipped by overflow-x-auto 
            */}
            <div className="w-full overflow-x-auto custom-scrollbar min-h-[350px] pb-32">
                <table className="w-full text-left border-collapse text-sm min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {!isReadOnly && (
                                <th className="p-3 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        checked={manager.selectedIds?.length === manager.activeTabData.length && manager.activeTabData.length > 0}
                                        onChange={() => manager.toggleSelection("ALL")}
                                    />
                                </th>
                            )}
                            <th className="p-3 font-bold text-xs text-gray-500 uppercase tracking-wider">SL</th>
                            {columns.map(col => (
                                <th key={col.id} className="p-3 font-bold text-xs text-gray-500 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                            <th className="p-3 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((row, idx) => (
                            <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                                {!isReadOnly && (
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                            checked={manager.selectedIds?.includes(row.id)}
                                            onChange={() => manager.toggleSelection(row.id)}
                                        />
                                    </td>
                                )}
                                <td className="p-3 text-gray-500 text-xs">
                                    {((manager.currentPage - 1) * 10) + idx + 1}
                                </td>

                                {columns.map(col => (
                                    <td key={col.id} className="p-3">
                                        {col.type === "currency" ? (
                                            <span className="font-medium text-gray-900">
                                                {(row[col.id as keyof typeof row] as number).toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                                            </span>
                                        ) : col.type === "badge" ? (
                                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {row[col.id as keyof typeof row]}
                                            </span>
                                        ) : col.type === "status" ? (
                                            /* --- STATUS DROPDOWN OR BADGE --- */
                                            isReadOnly ? (
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${row.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                                    row.status === "Due" ? "bg-rose-100 text-rose-700" :
                                                        "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    {row.status.replace("_", " ")}
                                                </span>
                                            ) : (
                                                <div className="w-32">
                                                    <CustomSelect
                                                        size="sm"
                                                        value={row.status}
                                                        options={[
                                                            { label: "Paid", value: "Paid" },
                                                            { label: "Due", value: "Due" },
                                                            { label: "Partially Paid", value: "Partially_paid" }
                                                        ]}
                                                        onChange={(val) => console.log('Update Status')}
                                                    />
                                                    <span className="text-xs text-brand-primary font-bold border-b border-dashed border-brand-primary/50 cursor-pointer">
                                                        {row.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            <span className="text-gray-700">{row[col.id as keyof typeof row]}</span>
                                        )}
                                    </td>
                                ))}

                                {/* --- ZERO 3-DOT MENUS --- */}
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon-sm" onClick={() => {
                                            manager.setActiveRecord(row);
                                            manager.setDrawerMode("transaction");
                                        }}>
                                            <Eye className="w-4 h-4 text-gray-500 hover:text-brand-primary transition-colors" />
                                        </Button>

                                        {!isReadOnly && (
                                            <>
                                                <Button variant="ghost" size="icon-sm">
                                                    <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700 transition-colors" />
                                                </Button>
                                                <Button variant="ghost" size="icon-sm">
                                                    <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-700 transition-colors" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {/* --- STICKY AGGREGATES --- */}
                    <tfoot className="bg-gray-100 border-t-2 border-gray-200 sticky bottom-0 z-10">
                        <tr>
                            <td colSpan={!isReadOnly ? 5 : 4} className="p-4 font-black text-gray-800 text-right uppercase tracking-wider text-xs">
                                Grand Total
                            </td>
                            <td className="p-4 font-black text-gray-900">
                                {totals.total.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td className="p-4 font-black text-emerald-700">
                                {totals.paid.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td className="p-4 font-black text-rose-700">
                                {totals.due.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Pagination Component mapped securely at the absolute bottom */}
            <div className="border-t border-gray-200 bg-white p-3 flex justify-end">
                <Pagination
                    currentPage={manager.currentPage}
                    onPageChange={manager.setCurrentPage}
                    totalPages={Math.ceil(manager.activeTabData.length / 10)}
                    perPage={10}
                />
                <div className="text-xs font-bold text-gray-400">Pagination Component Placeholder</div>
            </div>
        </div>
    );
}