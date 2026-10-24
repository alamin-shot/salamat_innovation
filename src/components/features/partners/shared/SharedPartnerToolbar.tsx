import { Search, Columns } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SharedPartnerManagerType } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";

export function SharedPartnerToolbar({ manager }: { manager: SharedPartnerManagerType }) {
    const { table, cols, partnerType } = manager;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-subtext/20 bg-white px-4 py-3">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-subtext" />
                <input
                    type="text"
                    placeholder={`Search ${partnerType}s...`}
                    value={table.searchQuery}
                    onChange={(e) => table.setSearchQuery(e.target.value)}
                    className="erp-input pl-10 pr-4"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="relative">
                    <Button type="button" variant="outline" onClick={() => manager.setShowColumnsMenu(!manager.showColumnsMenu)} className="gap-2 bg-white text-brand-text">
                        <Columns className="h-4 w-4 text-brand-subtext" /> Columns
                    </Button>
                    {manager.showColumnsMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => manager.setShowColumnsMenu(false)} />
                            <div className="absolute right-0 mt-2 w-48 z-20 rounded-lg border border-gray-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                <div className="flex flex-col gap-1.5 mb-2">
                                    {Object.entries(cols).map(([key, isVisible]) => (
                                        <label key={key} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded-md">
                                            <input type="checkbox" checked={Boolean(isVisible)} onChange={() => manager.toggleColumn(key as keyof typeof cols)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                                <Button type="button" variant="success" size="sm" onClick={manager.showAllColumns} className="w-full font-bold">Show All</Button>
                            </div>
                        </>
                    )}
                </div>
                <Button type="button" variant="success" onClick={manager.handleAdd} className="capitalize">
                    Add {partnerType}
                </Button>
            </div>
        </div>
    );
}