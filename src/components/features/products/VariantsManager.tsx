"use client";
import * as React from "react";
import { Trash2, X, Save, Search, Plus, ChevronDown, UploadCloud } from "lucide-react";

interface VariantsManagerProps {
    productId?: string | null;
    isQuickEdit?: boolean;
}

const DEFAULT_ATTRIBUTES = ["Color", "Region", "Storage", "Condition", "Strap", "Size", "Network"];

export function VariantsManager({ productId, isQuickEdit = false }: VariantsManagerProps) {
    // ----------------------------------------------------------------------
    // VIEW 1: QUICK EDIT MODAL
    // ----------------------------------------------------------------------
    if (isQuickEdit) {
        return (
            <div className="flex flex-col h-full bg-brand-bg/20">
                <div className="overflow-x-auto p-4 custom-scrollbar">
                    <table className="w-full min-w-[700px] border-separate border-spacing-y-3 text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                <th className="px-4 py-2">Variant</th>
                                <th className="px-4 py-2">Max Retail Price</th>
                                <th className="px-4 py-2">Sale Price</th>
                                <th className="px-4 py-2">Discount</th>
                                <th className="px-4 py-2">Stock</th>
                                <th className="px-4 py-2">Prebook</th>
                                <th className="px-4 py-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white shadow-sm rounded-xl outline outline-1 outline-brand-subtext/20">
                                <td className="px-4 py-3 rounded-l-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">V</div>
                                        <span className="inline-flex rounded-full bg-brand-bg px-3 py-1 text-xs font-semibold text-brand-text border border-brand-subtext/20">White</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" defaultValue="7500.00" className="w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" defaultValue="6385" className="w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </td>
                                <td className="px-4 py-3 font-medium text-brand-text">1115</td>
                                <td className="px-4 py-3">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input type="checkbox" defaultChecked className="peer sr-only" />
                                        <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative"></div>
                                        <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                                    </label>
                                </td>
                                <td className="px-4 py-3">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-brand-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative"></div>
                                        <span className="text-xs font-medium text-brand-subtext">Disabled</span>
                                    </label>
                                </td>
                                <td className="px-4 py-3 rounded-r-xl text-right">
                                    <button className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700">Save</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-auto shrink-0 flex items-center justify-between border-t border-brand-subtext/20 bg-white p-4">
                    <span className="text-sm font-medium text-brand-subtext">No unsaved changes</span>
                    <button className="flex items-center gap-2 rounded-md bg-indigo-50 px-5 py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100 border border-indigo-200">
                        <Save className="h-4 w-4" /> Save All
                    </button>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // VIEW 2: MASTER BUILDER (With Searchable Dropdowns & Fixed Clicks)
    // ----------------------------------------------------------------------
    const [attributeOptions, setAttributeOptions] = React.useState<string[]>(DEFAULT_ATTRIBUTES);
    const [rows, setRows] = React.useState([{ id: 1, name: "Region", values: ["Bahrain"] }]);

    // Dropdown UI States
    const [openNameDropdownId, setOpenNameDropdownId] = React.useState<number | null>(null);
    const [openValueDropdownId, setOpenValueDropdownId] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

    // The Ref used to detect clicks outside the builder area
    const builderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (builderRef.current && !builderRef.current.contains(event.target as Node)) {
                setOpenNameDropdownId(null);
                setOpenValueDropdownId(null);
                setSearchQuery("");
            }
        };
        // Using mousedown prevents conflicts with React's onClick synthetic events
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

    const handleAddNewAttribute = () => {
        if (searchQuery && !attributeOptions.includes(searchQuery)) {
            setAttributeOptions([...attributeOptions, searchQuery]);
            if (openNameDropdownId) updateRowName(openNameDropdownId, searchQuery);
        }
    };

    const handleAddNewValue = (rowId: number) => {
        if (searchQuery) addRowValue(rowId, searchQuery);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Attribute Builder with Ref */}
            <div ref={builderRef} className="flex flex-col gap-4 pb-6 border-b border-brand-subtext/20">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-brand-subtext uppercase mb-1">
                    <div className="col-span-4">Attribute Name <span className="text-red-500">*</span></div>
                    <div className="col-span-7">Attribute Value <span className="text-red-500">*</span></div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-start">

                        {/* 1. ATTRIBUTE NAME DROPDOWN */}
                        <div className="col-span-4 relative">
                            <div
                                onClick={() => {
                                    setOpenNameDropdownId(openNameDropdownId === row.id ? null : row.id);
                                    setOpenValueDropdownId(null);
                                    setSearchQuery("");
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${openNameDropdownId === row.id ? "border-emerald-600 ring-1 ring-emerald-600" : "border-brand-subtext/40 hover:border-brand-primary/50"}`}
                            >
                                <span className={row.name ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                    {row.name || "Choose a Attribute"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-brand-subtext" />
                            </div>

                            {openNameDropdownId === row.id && (
                                <div className="absolute left-0 top-[calc(100%+4px)] z-[100] w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl max-h-64 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                                    <div className="sticky top-0 bg-white p-2 border-b border-brand-subtext/10">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-subtext" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search attribute..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full rounded-md border border-brand-subtext/30 bg-brand-bg/50 py-1.5 pl-8 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto p-1 custom-scrollbar">
                                        {attributeOptions.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                            attributeOptions
                                                .filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map(opt => (
                                                    <div
                                                        key={opt}
                                                        onClick={() => updateRowName(row.id, opt)}
                                                        className="cursor-pointer rounded-sm px-3 py-2 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                    >
                                                        {opt}
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                                <span className="text-xs text-brand-subtext mb-2">no_options_found</span>
                                                <button onClick={handleAddNewAttribute} className="rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors">
                                                    <Plus className="h-3 w-3" /> Add "{searchQuery}"
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. ATTRIBUTE VALUE DROPDOWN */}
                        <div className="col-span-7 relative">
                            <div
                                onClick={() => {
                                    setOpenValueDropdownId(openValueDropdownId === row.id ? null : row.id);
                                    setOpenNameDropdownId(null);
                                    setSearchQuery("");
                                }}
                                className={`flex min-h-[38px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1.5 transition-colors ${openValueDropdownId === row.id ? "border-emerald-600 ring-1 ring-emerald-600" : "border-brand-subtext/40 hover:border-brand-primary/50"}`}
                            >
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
                                <div className="absolute left-0 top-[calc(100%+4px)] z-[100] w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl max-h-64 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                                    <div className="sticky top-0 bg-white p-2 border-b border-brand-subtext/10">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-subtext" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && searchQuery) {
                                                        e.preventDefault();
                                                        handleAddNewValue(row.id);
                                                    }
                                                }}
                                                className="w-full rounded-md border border-brand-subtext/30 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto p-1 custom-scrollbar">
                                        {searchQuery ? (
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <button
                                                    onClick={() => handleAddNewValue(row.id)}
                                                    className="rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" /> Add "{searchQuery}"
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-xs text-brand-subtext">no_options_found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-span-1 flex justify-center pt-2">
                            <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-2">
                    <button onClick={addRow} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
                        Add Another Option
                    </button>
                </div>
            </div>

            {/* FULLY IMPLEMENTED: Variant Image & Variant Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Variant Image Upload Zone */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-brand-text">Variant Image</h3>
                    <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50">
                        <UploadCloud className="mb-2 h-6 w-6 text-brand-subtext" />
                        <span className="text-sm font-medium text-brand-text">Upload images for variants</span>
                        <span className="text-xs text-brand-subtext">Drag & drop or click to browse</span>
                    </div>
                </div>

                {/* Variant Stock Configuration */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-brand-text">Variant Stock</h3>
                    <div className="flex h-32 w-full flex-col justify-center gap-4 rounded-lg border border-brand-subtext/20 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-brand-text">Track Inventory</span>
                            <label className="flex cursor-pointer items-center">
                                <input type="checkbox" defaultChecked className="peer sr-only" />
                                <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative"></div>
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider w-24">Base Stock</label>
                            <input type="number" placeholder="0" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Variants Table */}
            <div className="border-t border-brand-subtext/20 pt-6">
                <label className="flex cursor-pointer items-center gap-2 mb-4">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600" />
                    <span className="text-sm font-semibold text-brand-text">Select All</span>
                </label>

                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                <th className="px-4 py-2 text-center w-10"></th>
                                <th className="px-4 py-2">Variant Title</th>
                                <th className="px-4 py-2">SKU</th>
                                <th className="px-4 py-2">Max Retail Price</th>
                                <th className="px-4 py-2">Discount(%)</th>
                                <th className="px-4 py-2">Discount Fixed</th>
                                <th className="px-4 py-2">In Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white shadow-sm rounded-xl outline outline-1 outline-brand-subtext/20 hover:outline-emerald-500/30 transition-all">
                                <td className="px-4 py-3 rounded-l-xl text-center">
                                    <input type="checkbox" className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        <span className="rounded bg-brand-bg px-2 py-1 text-xs font-medium text-brand-text border border-brand-subtext/20">Bahrain</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 flex flex-col gap-1.5">
                                    <input type="text" className="w-36 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" />
                                    <button className="flex items-center justify-center gap-1 w-36 rounded-md border border-emerald-600 text-emerald-700 py-1 text-xs font-semibold hover:bg-emerald-50 transition-colors">
                                        Generate SKU
                                    </button>
                                </td>
                                <td className="px-4 py-3"><input type="number" className="w-24 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3"><input type="number" className="w-24 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3"><input type="number" className="w-24 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" /></td>
                                <td className="px-4 py-3 rounded-r-xl">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative"></div>
                                        <span className="text-xs font-medium text-brand-subtext whitespace-nowrap">Out of Stock</span>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-4">
                    <button className="rounded-md bg-emerald-700 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}