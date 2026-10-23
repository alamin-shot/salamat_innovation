import { Search, Columns } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FranchiseToolbar({ manager }: { manager: any }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-subtext/20 bg-white px-4 py-3">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-subtext" />
                <input
                    type="text"
                    placeholder="Search Franchises"
                    value={table.searchQuery}
                    onChange={(e) => table.setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="relative">
                    <Button type="button" variant="outline" onClick={() => manager.setShowColumnsMenu(!manager.showColumnsMenu)} className="gap-2 rounded-md border-brand-subtext/30 bg-white text-brand-text hover:bg-brand-bg">
                        <Columns className="h-4 w-4 text-brand-subtext" /> Columns
                    </Button>
                    {manager.showColumnsMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => manager.setShowColumnsMenu(false)} />
                            <div className="absolute right-0 mt-2 w-48 z-20 rounded-lg border border-brand-subtext/20 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                <div className="flex flex-col gap-1.5 mb-2">
                                    {Object.entries(cols).map(([key, isVisible]) => (
                                        <label key={key} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-brand-bg rounded-md">
                                            <input type="checkbox" checked={Boolean(isVisible)} onChange={() => manager.toggleColumn(key)} className="rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-xs text-brand-text capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                                <Button type="button" variant="success" size="sm" onClick={manager.showAllColumns} className="w-full rounded-md font-bold">Show All</Button>
                            </div>
                        </>
                    )}
                </div>
                <Button type="button" variant="success" onClick={manager.handleAdd} className="rounded-md px-6">
                    Add Franchise
                </Button>
            </div>
        </div>
    );
}