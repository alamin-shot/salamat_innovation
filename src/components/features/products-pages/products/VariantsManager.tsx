"use client";
import * as React from "react";
import { Trash2, X, Search, Plus, ChevronDown, UploadCloud } from "lucide-react";

interface VariantsManagerProps {
    productId?: string | null;
    isQuickEdit?: boolean;
}

const DEFAULT_ATTRIBUTES = ["Color", "Storage", "Condition"];

export function VariantsManager({ productId, isQuickEdit = false }: VariantsManagerProps) {
    const [attributeOptions, setAttributeOptions] = React.useState<string[]>(DEFAULT_ATTRIBUTES);
    const [rows, setRows] = React.useState([{ id: 1, name: "Storage", values: ["128GB"] }]);

    const [openNameDropdownId, setOpenNameDropdownId] = React.useState<number | null>(null);
    const [openValueDropdownId, setOpenValueDropdownId] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

    const builderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (builderRef.current && !builderRef.current.contains(event.target as Node)) {
                setOpenNameDropdownId(null);
                setOpenValueDropdownId(null);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addRow = () => setRows([...rows, { id: Date.now(), name: "", values: [] }]);
    const removeRow = (id: number) => setRows(rows.filter(r => r.id !== id));

    const updateRowName = (id: number, name: string) => {
        setRows(rows.map(r => r.id === id ? { ...r, name } : r));
        setOpenNameDropdownId(null);
        setSearchQuery("");
    };

    const addRowValue = (id: number, value: string) => {
        setRows(rows.map(r => {
            if (r.id === id && !r.values.includes(value)) {
                return { ...r, values: [...r.values, value] };
            }
            return r;
        }));
        setSearchQuery("");
        setOpenValueDropdownId(null);
    };

    const removeRowValue = (id: number, valueToRemove: string) => {
        setRows(rows.map(r => r.id === id ? { ...r, values: r.values.filter(v => v !== valueToRemove) } : r));
    };

    return (
        <div className="flex flex-col gap-8">
            <div ref={builderRef} className="flex flex-col gap-4 pb-6 border-b border-brand-subtext/20">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-brand-subtext uppercase tracking-wider mb-1">
                    <div className="col-span-5">Attribute Name <span className="text-red-500">*</span></div>
                    <div className="col-span-6">Attribute Value <span className="text-red-500">*</span></div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-start">
                        {/* ATTRIBUTE NAME */}
                        <div className="col-span-5 relative">
                            <div onClick={() => { setOpenNameDropdownId(openNameDropdownId === row.id ? null : row.id); setOpenValueDropdownId(null); }} className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${openNameDropdownId === row.id ? "border-emerald-600 ring-1 ring-emerald-600" : "border-brand-subtext/40"}`}>
                                <span className={row.name ? "text-brand-text font-medium" : "text-brand-subtext"}>{row.name || "Choose a Attribute"}</span>
                                <ChevronDown className="h-4 w-4 text-brand-subtext" />
                            </div>
                            {openNameDropdownId === row.id && (
                                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                    {attributeOptions.map(opt => (
                                        <div key={opt} onClick={() => updateRowName(row.id, opt)} className="cursor-pointer px-3 py-2 text-sm hover:bg-emerald-50 text-brand-text">{opt}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ATTRIBUTE VALUE */}
                        <div className="col-span-6 relative">
                            <div onClick={() => { setOpenValueDropdownId(openValueDropdownId === row.id ? null : row.id); setOpenNameDropdownId(null); }} className={`flex min-h-[38px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1.5 transition-colors ${openValueDropdownId === row.id ? "border-emerald-600 ring-1 ring-emerald-600" : "border-brand-subtext/40"}`}>
                                {row.values.length === 0 ? (
                                    <span className="px-1 text-sm text-brand-subtext">Choose a Attribute Value</span>
                                ) : (
                                    row.values.map(val => (
                                        <span key={val} className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                            {val}
                                            <X onClick={(e) => { e.stopPropagation(); removeRowValue(row.id, val); }} className="h-3 w-3 cursor-pointer hover:text-emerald-900 ml-0.5" />
                                        </span>
                                    ))
                                )}
                            </div>
                            {openValueDropdownId === row.id && (
                                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl p-2">
                                    <div className="relative mb-2">
                                        <input autoFocus type="text" placeholder="Type and press enter..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { e.preventDefault(); addRowValue(row.id, searchQuery); } }} className="w-full rounded-md border border-brand-subtext/30 bg-brand-bg/50 py-1.5 px-3 text-sm focus:border-emerald-500 focus:outline-none" />
                                    </div>
                                    <p className="text-xs text-brand-subtext text-center">Type a value and press Enter</p>
                                </div>
                            )}
                        </div>

                        <div className="col-span-1 flex justify-center pt-2">
                            {/* FIX: Added type="button" */}
                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-2">
                    {/* FIX: Added type="button" */}
                    <button type="button" onClick={addRow} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
                        Add Another Option
                    </button>
                </div>
            </div>

            {/* VARIANT IMAGE */}
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-brand-text">Variant Image</h3>
                <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50">
                    <UploadCloud className="mb-2 h-6 w-6 text-brand-subtext" />
                    <span className="text-sm font-medium text-brand-text">Upload images for variants</span>
                </div>
            </div>

            {/* VARIANT STOCK TABLE */}
            <div className="border-t border-brand-subtext/20 pt-6">
                <label className="flex cursor-pointer items-center gap-2 mb-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600" />
                    <span className="text-sm font-medium text-brand-text">Select All</span>
                </label>

                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-brand-subtext uppercase tracking-wider bg-brand-bg/40">
                                <th className="px-4 py-3 rounded-l-xl">VARIANT TITLE</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">MAX RETAIL PRICE</th>
                                <th className="px-4 py-3">DISCOUNT(%)</th>
                                <th className="px-4 py-3">DISCOUNT FIXED</th>
                                <th className="px-4 py-3">IN STOCK</th>
                                <th className="px-4 py-3 rounded-r-xl"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white shadow-sm outline outline-1 outline-brand-subtext/20">
                                <td className="px-4 py-3">
                                    <span className="font-medium text-brand-text">128GB</span>
                                </td>
                                <td className="px-4 py-3">
                                    <input type="text" className="w-32 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" />
                                </td>
                                <td className="px-4 py-3"><input type="number" className="w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3"><input type="number" className="w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3"><input type="number" className="w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600" />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {/* FIX: Added type="button" */}
                                    <button type="button" className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700">Save</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}