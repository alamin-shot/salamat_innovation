import { useState } from "react";
import { Search, Columns } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SharedPartnerManagerType } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";

export function SharedPartnerToolbar({ manager }: { manager: SharedPartnerManagerType }) {
    const { table, cols, labels } = manager;
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-b border-brand-subtext/20 bg-white px-4 py-3 sm:flex-row">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                <input type="text" placeholder={`Search ${labels.many.toLowerCase()}...`} value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} className="erp-input pl-10 pr-4" />
            </div>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <div className="relative">
                    <Button type="button" variant="outline" onClick={() => setShowColumnsMenu((open) => !open)} className="gap-2 bg-white text-brand-text">
                        <Columns className="h-4 w-4 text-brand-subtext" /> Columns
                    </Button>
                    {showColumnsMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowColumnsMenu(false)} />
                            <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                <div className="mb-2 flex flex-col gap-1.5">
                                    {Object.entries(cols).map(([key, isVisible]) => (
                                        <label key={key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50">
                                            <input type="checkbox" checked={isVisible} onChange={() => manager.toggleColumn(key)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                        </label>
                                    ))}
                                </div>
                                <Button type="button" variant="success" size="sm" onClick={manager.showAllColumns} className="w-full font-bold">Show All</Button>
                            </div>
                        </>
                    )}
                </div>
                <Button type="button" variant="success" onClick={manager.handleAdd}>
                    Add {labels.one}
                </Button>
            </div>
        </div>
    );
}
