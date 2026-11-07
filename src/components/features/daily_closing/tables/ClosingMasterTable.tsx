"use client";
import React, { useState, useMemo, memo } from "react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { getClosingColumns, ClosingColumnDef } from "@/hooks/daily_closing_hooks/closingColumnFactory";
import { Eye, Edit, Trash2, FileX, ArrowUpDown, Search, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ============================================================================
// 1. MEMOIZED DESKTOP ROW 
// ============================================================================
const DesktopRow = memo(({
    row, index, columns, isSelected, onToggle, isReadOnly, onView, onEdit, onDelete
}: {
    row: any, index: number, columns: ClosingColumnDef[], isSelected: boolean, onToggle: (id: string) => void, isReadOnly: boolean, onView: (row: any) => void, onEdit: (row: any) => void, onDelete: (row: any) => void
}) => (
    <tr className="hover:bg-gray-50/70 transition-colors group">
        {!isReadOnly && (
            <td className="p-3 text-center w-12">
                <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary transition-all"
                    checked={isSelected}
                    onChange={() => onToggle(row.id)}
                />
            </td>
        )}
        <td className="p-3 text-gray-500 text-xs w-12">{index + 1}</td>

        {columns.map(col => (
            <td key={col.id} className="p-3">
                {col.type === "currency" ? (
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                        {(row[col.id] as number).toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                    </span>
                ) : col.type === "badge" ? (
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                        {row[col.id]}
                    </span>
                ) : col.type === "status" ? (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap ${row.status === "Paid" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                        row.status === "Due" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                            "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}>
                        {row.status.replace("_", " ")}
                    </span>
                ) : (
                    <span className="text-gray-700 text-sm">{row[col.id]}</span>
                )}
            </td>
        ))}

        <td className="p-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => onView(row)}>
                    <Eye className="w-4 h-4 text-gray-500 hover:text-brand-primary" />
                </Button>

                {/* Edit & Delete are only accessible if the day is not locked/submitted */}
                {!isReadOnly && (
                    <>
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row)}>
                            <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row)}>
                            <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-700" />
                        </Button>
                    </>
                )}
            </div>
        </td>
    </tr>
));
DesktopRow.displayName = "DesktopRow";

// ============================================================================
// 2. MEMOIZED MOBILE CARD
// ============================================================================
const MobileCard = memo(({
    row, isSelected, onToggle, isReadOnly, onView, onEdit, onDelete
}: {
    row: any, isSelected: boolean, onToggle: (id: string) => void, isReadOnly: boolean, onView: (row: any) => void, onEdit: (row: any) => void, onDelete: (row: any) => void
}) => (
    <div className={`flex flex-col bg-white border rounded-xl p-4 gap-3 shadow-sm transition-all ${isSelected ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
                {!isReadOnly && (
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-brand-primary w-5 h-5"
                        checked={isSelected}
                        onChange={() => onToggle(row.id)}
                    />
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900">{row.party}</span>
                    <span className="text-xs font-bold text-gray-400">{row.invoiceNumber} • {row.paymentMethod}</span>
                </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${row.status === "Paid" ? "bg-emerald-100 text-emerald-700" : row.status === "Due" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                }`}>
                {row.status.replace("_", " ")}
            </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col"><span className="text-[9px] font-bold text-gray-400 uppercase">Total</span><span className="text-xs font-black text-gray-900">৳{row.total.toLocaleString()}</span></div>
            <div className="flex flex-col border-x border-gray-200"><span className="text-[9px] font-bold text-gray-400 uppercase">Paid</span><span className="text-xs font-black text-emerald-600">৳{row.paidAmount.toLocaleString()}</span></div>
            <div className="flex flex-col"><span className="text-[9px] font-bold text-gray-400 uppercase">Due</span><span className="text-xs font-black text-rose-600">৳{row.dueAmount.toLocaleString()}</span></div>
        </div>

        <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400 font-medium">By: {row.sellerOrCreator}</span>
            <div className="flex items-center gap-1.5">
                {/* Mobile Action Buttons */}
                {!isReadOnly && (
                    <>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-gray-200 text-blue-600 hover:bg-blue-50" onClick={() => onEdit(row)}>
                            <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-gray-200 text-rose-600 hover:bg-rose-50" onClick={() => onDelete(row)}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200 shadow-2xs" onClick={() => onView(row)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>
            </div>
        </div>
    </div>
));
MobileCard.displayName = "MobileCard";

// ============================================================================
// 3. THE MASTER ORCHESTRATOR 
// ============================================================================
export function ClosingMasterTable({ manager }: { manager: ReturnType<typeof useClosingManager> }) {
    const columns = useMemo(() => getClosingColumns(manager.activeTab), [manager.activeTab]);
    const { isLocked, isSubmitted } = manager;
    const isReadOnly = isLocked || isSubmitted;

    // --- LOCAL POWER STATE (Search & Sort) ---
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: string) => {
        setSortConfig(current =>
            current?.key === key && current.direction === "asc" ? { key, direction: "desc" } : { key, direction: "asc" }
        );
    };

    // --- DATA PIPELINE (Filter -> Sort) ---
    const processedData = useMemo(() => {
        let data = [...manager.activeTabData];

        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(row =>
                row.invoiceNumber.toLowerCase().includes(lowerQuery) ||
                row.party.toLowerCase().includes(lowerQuery)
            );
        }

        if (sortConfig) {
            data.sort((a, b) => {
                const aVal = a[sortConfig.key as keyof typeof a];
                const bVal = b[sortConfig.key as keyof typeof b];
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [manager.activeTabData, searchQuery, sortConfig]);

    // Local Pagination
    const perPage = 10;
    const paginatedData = processedData.slice((manager.currentPage - 1) * perPage, manager.currentPage * perPage);

    // Sticky Aggregate Math based strictly on filtered dataset
    const totals = useMemo(() => processedData.reduce((acc, row) => ({
        total: acc.total + row.total, paid: acc.paid + row.paidAmount, due: acc.due + row.dueAmount
    }), { total: 0, paid: 0, due: 0 }), [processedData]);


    // --- ACTION HANDLERS ---
    const handleView = (row: any) => {
        manager.setActiveRecord(row);
        manager.setDrawerMode("transaction");
    };

    const handleEdit = (row: any) => {
        manager.setActiveRecord(row);
        manager.setDrawerMode("edit");
    };

    const handleDelete = (row: any) => {
        console.log("Delete Triggered for:", row);
        if (confirm(`Are you sure you want to delete ${row.invoiceNumber}?`)) {
            // TODO: Wire to your global Zustand Delete Action
            alert(`${row.invoiceNumber} deleted!`);
        }
    };


    if (manager.activeTabData.length === 0) {
        return (
            <div className="bg-white flex flex-col items-center justify-center border border-gray-200 text-center min-h-[350px] rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                    <FileX className="w-5 h-5 text-gray-300" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">No records found</h3>
                <p className="text-xs font-medium text-gray-400 mt-1">Ledger is empty for {manager.activeDate}.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-sm rounded-xl">

            {/* TOOLBAR */}
            <div className="p-3 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search invoice or party..."
                        className="erp-input pl-9 h-9 w-full text-sm font-medium bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    {processedData.length} Records Found
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block w-full overflow-auto custom-scrollbar flex-1 relative">
                <table className="w-full text-left border-collapse text-sm min-w-max">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                        <tr>
                            {!isReadOnly && (
                                <th className="p-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        checked={manager.selectedIds?.length === processedData.length && processedData.length > 0}
                                        onChange={() => manager.toggleSelection("ALL")}
                                    />
                                </th>
                            )}
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider w-12">SL</th>
                            {columns.map(col => (
                                <th key={col.id} className="p-3">
                                    <button
                                        className="font-black text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                                        onClick={() => handleSort(col.id)}
                                    >
                                        {col.label}
                                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                                    </button>
                                </th>
                            ))}
                            <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((row, idx) => (
                            <DesktopRow
                                key={row.id}
                                row={row}
                                index={(manager.currentPage - 1) * perPage + idx}
                                columns={columns}
                                isSelected={manager.selectedIds?.includes(row.id)}
                                onToggle={manager.toggleSelection}
                                isReadOnly={isReadOnly}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>

                    {/* Invisible Spacer ensures dropdowns can open without getting clipped by container */}
                    <tbody>
                        <tr className="h-24 border-none pointer-events-none bg-transparent">
                            <td colSpan={columns.length + 2}></td>
                        </tr>
                    </tbody>

                    {/* STICKY AGGREGATES */}
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <tr>
                            <td colSpan={!isReadOnly ? 4 : 3} className="p-4 font-black text-gray-800 text-right uppercase tracking-wider text-xs">
                                Grand Total
                            </td>
                            <td className="p-4 font-black text-gray-900">
                                {totals.total.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td className="p-4 font-black text-emerald-600">
                                {totals.paid.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td className="p-4 font-black text-rose-600">
                                {totals.due.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="flex flex-col md:hidden p-3 gap-3 bg-gray-50/50 flex-1 overflow-auto custom-scrollbar pb-28">
                {paginatedData.map(row => (
                    <MobileCard
                        key={row.id}
                        row={row}
                        isSelected={manager.selectedIds?.includes(row.id)}
                        onToggle={manager.toggleSelection}
                        isReadOnly={isReadOnly}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* MOBILE STICKY TOTALS */}
            <div className="md:hidden fixed bottom-[60px] left-0 right-0 bg-white border-t border-gray-200 p-3 z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-black uppercase text-gray-500">Total Rec:</span>
                    <span className="font-black text-emerald-600">{totals.paid.toLocaleString('en-IN', { style: 'currency', currency: 'BDT' })}</span>
                </div>
            </div>

            {/* Pagination Docked at Bottom */}
            <div className="border-t border-gray-200 bg-white p-3 flex justify-end shrink-0 z-40 relative">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Page {manager.currentPage} of {Math.max(1, Math.ceil(processedData.length / perPage))}
                </div>
            </div>
        </div>
    );
}