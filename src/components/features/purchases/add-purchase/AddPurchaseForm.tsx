"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Trash2, ChevronDown, Check, Image as ImageIcon, Search } from "lucide-react";
import { useAddPurchaseManager } from "@/hooks/useAddPurchaseManager";

// Reusable headless dropdown strictly for this form
const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (v: string) => void, options: string[], placeholder: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="relative w-full">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <span className={value ? "text-gray-700" : "text-gray-400"}>{value || placeholder}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full z-20 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                        {options.map(opt => (
                            <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                                {opt}
                                {value === opt && <Check className="h-4 w-4 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export function AddPurchaseForm() {
    const manager = useAddPurchaseManager();

    return (
        <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">

            {/* Top Grid: Supplier & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Left Side */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-600">Supplier</label>
                        <div className="flex gap-2">
                            <CustomSelect
                                value={manager.supplier}
                                onChange={manager.setSupplier}
                                options={["Rasel Raj", "Bina Ambix", "Gadget Opia", "Cell Tech BD"]}
                                placeholder="Choose a Supplier"
                            />
                            <button onClick={manager.openAddSupplierModal} className="shrink-0 rounded bg-[#108c5d] px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors">
                                Add Supplier
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-600">Invoice/Bill</label>
                        <div className="flex items-center gap-4 rounded border border-dashed border-gray-300 bg-gray-50/50 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-white border border-gray-200 text-gray-400 shadow-sm">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col text-[12px] text-gray-500">
                                <span>Recommended size: 300 X 90 PX</span>
                                <span>Max file size: 2MB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-600">Date <span className="text-red-500">*</span></label>
                        <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                        <button
                            type="button"
                            onClick={manager.toggleManualEntry}
                            className="w-full rounded bg-gray-100 border border-gray-200 py-2 text-[13px] text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            Create Barcode
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Section: Search, Manual Entry, & Queue */}
            <div className="flex flex-col gap-3">
                <label className="text-[13px] text-gray-600">Search by Barcode</label>

                {/* Toggled Manual Entry Row */}
                {manager.isManualEntryOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-1 mt-2 p-4 border border-gray-100 bg-gray-50 rounded">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-600">Product <span className="text-red-500">*</span></label>
                            <CustomSelect value={manager.manualProduct} onChange={manager.setManualProduct} options={["Galaxy S25 Ultra", "iPhone 15 Pro", "Nothing Phone 4a"]} placeholder="Choose a product" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-600">Variant <span className="text-red-500">*</span></label>
                            <CustomSelect value={manager.manualVariant} onChange={manager.setManualVariant} options={["Titanium Black", "White", "12GB/512GB"]} placeholder="Choose a Variant" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-600">Serial/IMEI no.</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Serial/IMEI no." value={manager.manualSerial} onChange={(e) => manager.setManualSerial(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none" />
                                <button onClick={manager.handleSuggestSerial} className="shrink-0 rounded bg-[#eab308] px-4 py-2 text-[13px] font-bold text-white hover:bg-yellow-600 transition-colors">Suggest</button>
                                <button onClick={manager.handleApplyManualItem} className="shrink-0 rounded bg-[#108c5d] px-4 py-2 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors">Apply</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative mb-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="text" placeholder="Search Product By Code" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>

                {/* Queue Table */}
                <div className="rounded border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 bg-gray-50/80 font-semibold text-gray-600">SL</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Product Name</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">SKU</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Unit Price</TableHeadCell>
                            <TableHeadCell className="text-center w-[120px] bg-gray-50/80 font-semibold text-gray-600">Quantity</TableHeadCell>
                            <TableHeadCell className="text-right bg-gray-50/80 font-semibold text-gray-600">Total Price</TableHeadCell>
                            <TableHeadCell className="text-right w-[80px] bg-gray-50/80 font-semibold text-gray-600">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {manager.stagedItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-[13px] text-gray-500">No products added</TableCell>
                                </TableRow>
                            ) : (
                                manager.stagedItems.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700">{item.productName}</span>
                                                <span className="text-[10px] text-emerald-600">{item.variant}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><span className="text-[13px] text-gray-600">{item.sku}</span></TableCell>
                                        <TableCell><span className="text-[13px] text-gray-600">{item.serial}</span></TableCell>
                                        <TableCell><span className="text-[13px] text-gray-600">{item.unitPrice}</span></TableCell>
                                        <TableCell className="text-center">
                                            <input type="number" min="1" value={item.quantity} onChange={(e) => manager.handleQuantityChange(item.id, parseInt(e.target.value) || 1)} className="w-16 rounded border border-gray-200 text-center text-[13px] py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 mx-auto" />
                                        </TableCell>
                                        <TableCell className="text-right"><span className="text-[13px] text-gray-700 font-medium">{(item.unitPrice * item.quantity).toLocaleString()}</span></TableCell>
                                        <TableCell className="text-right">
                                            <button onClick={() => manager.handleRemoveItem(item.id)} className="inline-flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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

            {/* Bottom Section: Calculation & Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">

                {/* Left Side: Inputs Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                    <div>
                        <label className="text-[13px] text-gray-500 mb-2 block">Discount Type</label>
                        <CustomSelect value={manager.discountType} onChange={manager.setDiscountType} options={["Fixed", "Percentage"]} placeholder="Choose a Discount Type" />
                    </div>
                    <div>
                        <label className="text-[13px] text-gray-500 mb-2 block">Discount Amount</label>
                        <input type="number" value={manager.discountAmount || ""} onChange={(e) => manager.setDiscountAmount(parseFloat(e.target.value) || 0)} placeholder="Discount Amount" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label className="text-[13px] text-gray-500 mb-2 block">Order Tax</label>
                        <input type="number" value={manager.orderTaxPct || ""} onChange={(e) => manager.setOrderTaxPct(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label className="text-[13px] text-gray-500 mb-2 block">Shipping</label>
                        <input type="number" value={manager.shippingCost || ""} onChange={(e) => manager.setShippingCost(parseFloat(e.target.value) || 0)} placeholder="Shipping Cost" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                </div>

                {/* Right Side: Live Ledger Table */}
                <div className="flex flex-col border border-gray-100 rounded bg-white">
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                        <span>Sub Total</span>
                        <span>৳ {manager.totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                        <span>Discount</span>
                        <span>{manager.totals.discount}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                        <span>Order Tax</span>
                        <span>{manager.totals.tax} (%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                        <span>Shipping</span>
                        <span>৳ {manager.totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] text-blue-500 p-3.5">
                        <span>Grand Total</span>
                        <span>৳ {manager.totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
                <button
                    onClick={manager.handleSavePurchase}
                    className="rounded bg-[#108c5d] px-6 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    );
}