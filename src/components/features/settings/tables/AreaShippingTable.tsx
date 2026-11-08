"use client";
import React, { memo } from "react";
import { AreaShippingRecord } from "@/store/useGlobalSettingsStore";
import { Edit, MapPin, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

const AreaRow = memo(({
    row, onEdit
}: {
    row: AreaShippingRecord, onEdit: (row: AreaShippingRecord) => void
}) => (
    <tr className="hover:bg-gray-50/70 transition-colors group">
        <td className="p-3">
            <span className="text-sm text-gray-700 font-medium">{row.district}</span>
        </td>
        <td className="p-3">
            <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-sm font-bold text-gray-900">{row.area}</span>
            </div>
        </td>
        <td className="p-3 text-sm text-gray-700 font-medium">{row.thana}</td>
        <td className="p-3 text-sm text-gray-700 font-mono">{row.postcode}</td>
        <td className="p-3">
            {row.chargeType === "default" && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Default</span>}
            {row.chargeType === "free" && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Free</span>}
            {row.chargeType === "custom" && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{row.customAmount} BDT</span>}
        </td>
        <td className="p-3 text-right">
            <div className="flex items-center justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 border border-transparent hover:border-brand-primary/20" onClick={() => onEdit(row)}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Charge
                </Button>
            </div>
        </td>
    </tr>
));
AreaRow.displayName = "AreaRow";

export function AreaShippingTable({ manager }: { manager: any }) {
    const data = manager.paginatedData as AreaShippingRecord[];

    const handleEdit = (row: AreaShippingRecord) => {
        manager.setActiveRecord(row);
        manager.setDrawerMode("shipping_form");
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                    <input type="text" placeholder="Search by area, district, or postcode..." className="erp-input h-9 text-sm" value={manager.searchQuery} onChange={e => manager.setSearchQuery(e.target.value)} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-sm rounded-xl">
                {data.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <SearchX className="w-8 h-8 text-gray-300 mb-3" />
                        <h3 className="text-sm font-black text-gray-900">No Areas Found</h3>
                    </div>
                ) : (
                    <div className="w-full overflow-auto custom-scrollbar flex-1 relative">
                        <table className="w-full text-left border-collapse text-sm min-w-max">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">District</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Area</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Thana</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Postcode</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider">Shipping Charge</th>
                                    <th className="p-3 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row) => (
                                    <AreaRow key={row.id} row={row} onEdit={handleEdit} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end shrink-0">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Page {manager.currentPage} of {Math.max(1, Math.ceil(manager.processedData.length / manager.perPage))}
                    </div>
                </div>
            </div>
        </div>
    );
}