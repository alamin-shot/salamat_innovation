"use client";
import React, { memo } from "react";
import { Edit, Trash2, Store, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ShopRecord } from "@/types/settings";

const ShopRow = memo(({
    row, isSelected, onToggle, onEdit, onDelete
}: {
    row: ShopRecord, isSelected: boolean, onToggle: (id: string, len: number) => void, onEdit: (row: ShopRecord) => void, onDelete: (id: string) => void
}) => (
    <tr className="hover:bg-gray-50/70 transition-colors group">
        <td className="p-3 text-center w-12">
            <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                checked={isSelected}
                onChange={() => onToggle(row.id, 1)}
            />
        </td>
        <td className="p-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{row.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{row.email || "No email"}</span>
                </div>
            </div>
        </td>
        <td className="p-3 text-sm text-gray-700 font-medium">{row.phone}</td>
        <td className="p-3 text-sm text-gray-700 font-medium">{row.createdAt}</td>
        <td className="p-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${row.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {row.status}
            </span>
        </td>
        <td className="p-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row)}>
                    <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.id)}>
                    <Trash2 className="w-4 h-4 text-rose-500 hover:text-rose-700" />
                </Button>
            </div>
        </td>
    </tr>
));
ShopRow.displayName = "ShopRow";

export function ShopsMasterTable({ manager }: { manager: any }) {
    const data = manager.paginatedData as ShopRecord[];

    const handleEdit = (row: ShopRecord) => {
        manager.setActiveRecord(row);
        manager.setDrawerMode("shop_form");
    };

    return (
        <div className="flex flex-col h-full relative">

            {/* Search & Bulk Actions Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Search shops by name, phone, or email..."
                        className="erp-input h-9 text-sm"
                        value={manager.searchQuery}
                        onChange={e => manager.setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Mass Actions Injection */}
            {manager.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={() => manager.setSelectedIds([])}>
                    <Button variant="default" size="sm" className="bg-rose-500 hover:bg-rose-600 text-white h-8 text-xs font-bold" onClick={() => manager.executeMassDelete(manager.store.deleteShops)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
                    </Button>
                </BulkActionBar>
            )}

            {/* Table Container */}
            <div className="bg-white border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-sm rounded-xl">
                {data.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <SearchX className="w-8 h-8 text-gray-300 mb-3" />
                        <h3 className="text-sm font-black text-gray-900">No Shops Found</h3>
                    </div>
                ) : (
                    <div className="w-full overflow-auto custom-scrollbar flex-1 relative">
                        <table className="w-full text-left border-collapse text-sm min-w-max">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 w-12 text-center">
                                        <input type="checkbox" className="rounded border-gray-300" checked={manager.selectedIds.length === manager.processedData.length && manager.processedData.length > 0} onChange={() => manager.toggleSelection("ALL", manager.processedData.length)} />
                                    </th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Shop Profile</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Created At</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row) => (
                                    <ShopRow key={row.id} row={row} isSelected={manager.selectedIds.includes(row.id)} onToggle={manager.toggleSelection} onEdit={handleEdit} onDelete={(id) => manager.store.deleteShops([id])} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Standard Pagination Dock */}
                <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end shrink-0">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Page {manager.currentPage} of {Math.max(1, Math.ceil(manager.processedData.length / manager.perPage))}
                    </div>
                </div>
            </div>
        </div>
    );
}