"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Trash2, ChevronDown, Check } from "lucide-react";
import { useCreateBarcodeManager } from "@/hooks/useCreateBarcodeManager";

export function CreateBarcodeForm() {
    const manager = useCreateBarcodeManager();

    // Local state for our sleek custom dropdowns
    const [isProductOpen, setIsProductOpen] = React.useState(false);
    const [isAttributeOpen, setIsAttributeOpen] = React.useState(false);

    const productOptions = ["iPhone 13 Pro", "XIAOMI MIJIA Steamer", "Nothing Phone 4a", "VOLTME Revo 140W"];
    const attributeOptions = ["Silver/128GB", "White", "Black", "Midnight Black/8GB/256GB"];

    return (
        <>
            {/* Top Selection Area with Custom Dropdowns */}
            <div className="flex flex-col md:flex-row items-end gap-4 border-b border-brand-subtext/20 pb-6">
                <div className="flex-1 w-full flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-brand-subtext tracking-wider">
                        Product <span className="text-red-500">*</span>
                    </label>
                    <button
                        onClick={() => { setIsProductOpen(!isProductOpen); setIsAttributeOpen(false); }}
                        className="flex w-full items-center justify-between rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                        <span className={manager.selectedProduct ? "text-brand-text" : "text-brand-subtext"}>
                            {manager.selectedProduct || "Choose a product"}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform ${isProductOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isProductOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProductOpen(false)} />
                            <div className="absolute top-full left-0 mt-1 w-full z-20 rounded-lg border border-brand-subtext/20 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                                {productOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => { manager.setSelectedProduct(opt); setIsProductOpen(false); }}
                                        className="flex w-full items-center justify-between px-4 py-2 text-sm text-brand-text hover:bg-brand-bg transition-colors"
                                    >
                                        {opt}
                                        {manager.selectedProduct === opt && <Check className="h-4 w-4 text-emerald-600" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex-1 w-full flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-brand-subtext tracking-wider">
                        Attribute <span className="text-red-500">*</span>
                    </label>
                    <button
                        onClick={() => { setIsAttributeOpen(!isAttributeOpen); setIsProductOpen(false); }}
                        className="flex w-full items-center justify-between rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                        <span className={manager.selectedAttribute ? "text-brand-text" : "text-brand-subtext"}>
                            {manager.selectedAttribute || "Choose an attribute"}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform ${isAttributeOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isAttributeOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsAttributeOpen(false)} />
                            <div className="absolute top-full left-0 mt-1 w-full z-20 rounded-lg border border-brand-subtext/20 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                                {attributeOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => { manager.setSelectedAttribute(opt); setIsAttributeOpen(false); }}
                                        className="flex w-full items-center justify-between px-4 py-2 text-sm text-brand-text hover:bg-brand-bg transition-colors"
                                    >
                                        {opt}
                                        {manager.selectedAttribute === opt && <Check className="h-4 w-4 text-emerald-600" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={manager.handleAddToQueue}
                    className="rounded-md bg-brand-bg border border-brand-subtext/30 px-6 py-2.5 text-sm font-bold text-brand-text transition-colors hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                >
                    Add
                </button>
            </div>

            {/* Staging Queue Table */}
            <div className="flex flex-col gap-1.5 flex-1 mt-6">
                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                    Order Queue <span className="text-red-500">*</span>
                </label>
                <div className="rounded-lg border border-brand-subtext/20 bg-brand-bg/30 overflow-hidden flex-1">
                    <Table>
                        <TableHeader>
                            <TableHeadCell>Product</TableHeadCell>
                            <TableHeadCell>SKU</TableHeadCell>
                            <TableHeadCell>Retail Price</TableHeadCell>
                            <TableHeadCell className="text-center w-[120px]">Quantity</TableHeadCell>
                            <TableHeadCell className="text-right w-[100px]">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.stagedItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-brand-subtext">
                                        No products added to generation queue
                                    </TableCell>
                                </TableRow>
                            ) : (
                                manager.stagedItems.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-white transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-brand-text">{item.productName}</span>
                                                <span className="text-[10px] font-bold text-emerald-600">{item.attribute}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><span className="text-sm font-mono text-brand-subtext">{item.sku}</span></TableCell>
                                        <TableCell><span className="text-sm text-brand-text">৳ {item.retailPrice.toLocaleString()}</span></TableCell>
                                        <TableCell className="text-center">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => manager.handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                className="w-16 rounded-md border border-brand-subtext/30 bg-white px-2 py-1 text-center text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-emerald-500 mx-auto"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                onClick={() => manager.handleRemoveFromQueue(item.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={manager.handleGenerateBarcodes}
                    disabled={manager.stagedItems.length === 0}
                    className="rounded-md bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate Barcode
                </button>
            </div>
        </>
    );
}