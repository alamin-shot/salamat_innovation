import { Search, Filter, Columns } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function TelesalesToolbar({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const resultOptions = ["All Results", "Shop Visit", "Follow Up", "Waiting"];
    const salesmanOptions = ["All Salesmen", "Jannat Ull Naeem Sarah", "-"];
    const customerTypeOptions = ["All Types", "New", "Existing"];

    return (
        <div className="flex flex-col border-b border-brand-subtext/20 bg-white">
            {/* Primary Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-brand-subtext" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={table.searchQuery}
                        onChange={(e) => table.setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-10 pr-4 text-sm text-brand-text focus:border-emerald-500 focus:outline-none"
                    />
                </div>

                {/* Right Controls: Filter, Columns, Add Telesale */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => manager.setShowFilterBar(!manager.showFilterBar)}
                        className={`gap-2 rounded-md border-brand-subtext/30 ${manager.showFilterBar
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-white text-brand-text hover:bg-brand-bg"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </Button>

                    {/* Columns Visibility Menu */}
                    <div className="relative">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => manager.setShowColumnsMenu(!manager.showColumnsMenu)}
                            className="gap-2 rounded-md border-brand-subtext/30 bg-white text-brand-text hover:bg-brand-bg"
                        >
                            <Columns className="h-4 w-4 text-brand-subtext" /> Columns
                        </Button>

                        {manager.showColumnsMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => manager.setShowColumnsMenu(false)} />
                                <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto z-20 rounded-lg border border-brand-subtext/20 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                    <div className="flex flex-col gap-1.5 mb-2">
                                        {Object.entries(cols).map(([key, isVisible]) => (
                                            <label
                                                key={key}
                                                className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-brand-bg rounded-md"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(isVisible)}
                                                    onChange={() => manager.toggleColumn(key)}
                                                    className="rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-xs text-brand-text capitalize">
                                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="success"
                                        size="sm"
                                        onClick={manager.showAllColumns}
                                        className="w-full rounded-md font-bold"
                                    >
                                        Show All
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <Button variant="success" size="sm" onClick={manager.handleCreate} className="h-9 px-4">
                        Add Telesale
                    </Button>
                </div>
            </div>

            {/* Expandable Filter Row (matching image_1236de.png) */}
            {manager.showFilterBar && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3 animate-in fade-in slide-in-from-top-1">
                    <input
                        type="date"
                        value={manager.filterDate}
                        onChange={(e) => manager.setFilterDate(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none h-9"
                    />
                    <CustomSelect
                        value={manager.filterResult}
                        onChange={manager.setFilterResult}
                        options={resultOptions}
                        placeholder="Result"
                    />
                    <CustomSelect
                        value={manager.filterSalesman}
                        onChange={manager.setFilterSalesman}
                        options={salesmanOptions}
                        placeholder="Salesman Name"
                    />
                    <CustomSelect
                        value={manager.filterCustomerType}
                        onChange={manager.setFilterCustomerType}
                        options={customerTypeOptions}
                        placeholder="Customer Type"
                    />
                </div>
            )}
        </div>
    );
}