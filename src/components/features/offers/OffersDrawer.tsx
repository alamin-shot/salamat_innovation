"use client";
import * as React from "react";
import { OffersManagerType } from "@/hooks/offers_hooks/useOffersManager";
import { useOfferForm } from "@/hooks/offers_hooks/useOfferForm";
import { Offer, OfferInput, OfferProductView } from "@/types/offers";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { Image as ImageIcon, Trash2, Bold, Italic, Underline, Link } from "lucide-react";

const money = (value: number | null) => (value === null ? "—" : `৳${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);

/** Price and discount come from Products (MRP − selling price); nothing is typed here. */
const OfferProductRow = React.memo(function OfferProductRow({ product, onRemove }: { product: OfferProductView; onRemove: (id: string) => void }) {
    const discount = product.discountState === "unavailable"
        ? <span className="text-xs font-semibold text-rose-600">Not in Products</span>
        : product.discountState === "incomplete"
            ? <span className="text-xs text-gray-400">Price not set in Products</span>
            : product.discountState === "discounted"
                ? <span className="font-semibold text-emerald-700">{money(product.discountAmount)} <span className="text-xs">({product.discountPercent}%)</span></span>
                : product.discountState === "selling_above_mrp"
                    ? <span className="text-xs font-semibold text-amber-600">Selling above MRP</span>
                    : <span className="text-xs text-gray-500">No discount</span>;
    return (
        <tr className="bg-white">
            <td className="px-4 py-3">
                <div className="font-semibold text-gray-900">{product.productName}</div>
                <div className="text-xs text-gray-500">{product.variantName}</div>
            </td>
            <td className="px-4 py-3 text-gray-600">{product.sku || "—"}</td>
            <td className="px-4 py-3 text-right font-medium">{money(product.maxRetailPrice)}</td>
            <td className="px-4 py-3 text-right font-medium">{money(product.sellingPrice)}</td>
            <td className="px-4 py-3 text-right">{discount}</td>
            <td className="px-4 py-2 text-center">
                <Button variant="destructive-ghost" size="icon-sm" onClick={() => onRemove(product.id)} title="Remove">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
});
OfferProductRow.displayName = "OfferProductRow";

function OfferFormBody({ offer, onSubmit, onClose }: { offer: Offer | null; onSubmit: (data: OfferInput) => void; onClose: () => void }) {
    const form = useOfferForm(offer, onSubmit);
    return (
                <div className="flex flex-col min-h-full pt-6">
                    <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col gap-2 px-4 pb-32">

                        {/* Header Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                            <div className="flex flex-col gap-1.5 lg:col-span-3">
                                <label className="erp-label">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    placeholder="Enter offer title"
                                    value={form.form.title}
                                    onChange={(e) => form.setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Banner</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg h-[42px] flex items-center justify-center bg-gray-50 hover:bg-brand-primary/5 cursor-pointer">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor Mockup */}
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Description</label>
                            <div className="border border-gray-300 rounded-md overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all">
                                <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">Normal</span>
                                    <div className="h-4 w-px bg-gray-300 mx-1" />
                                    <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Underline className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon-sm" className="h-7 w-7"><Link className="h-3.5 w-3.5" /></Button>
                                </div>
                                <textarea
                                    className="w-full p-3 h-32 resize-none focus:outline-none text-sm text-gray-700"
                                    value={form.form.description}
                                    onChange={(e) => form.setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Settings Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Start At <span className="text-red-500">*</span></label>
                                <DatePicker
                                    value={form.startDay}
                                    onChange={form.setStartDay}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">End At <span className="text-red-500">*</span></label>
                                <DatePicker
                                    value={form.endDay}
                                    onChange={form.setEndDay}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Type <span className="text-red-500">*</span></label>
                                <CustomSelect
                                    value={form.form.type}
                                    options={form.offerTypes}
                                    onChange={form.setType}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Status <span className="text-red-500">*</span></label>
                                <CustomSelect
                                    value={form.form.status}
                                    options={["Active", "Inactive"]}
                                    onChange={form.setStatus}
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        {/* Dynamic Products Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="erp-label">Products</label>
                                    <CustomSelect value={form.pickedProductId} options={form.productOptions} onChange={form.pickProduct} placeholder="Select Products" />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="erp-label">Variant</label>
                                    <CustomSelect value={form.pickedVariantId} options={form.variantOptions} onChange={form.setPickedVariantId} placeholder="Choose a Variant" disabled={!form.pickedProductId} />
                                </div>
                                <Button variant="success" onClick={form.addPicked} className="h-9 px-8 shrink-0">
                                    Add
                                </Button>
                            </div>

                            {form.rows.length > 0 && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden mt-2">
                                    <table className="w-full text-left text-sm text-gray-700">
                                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3">Product Name</th>
                                                <th className="px-4 py-3">SKU</th>
                                                <th className="px-4 py-3 text-right">MRP</th>
                                                <th className="px-4 py-3 text-right">Selling Price</th>
                                                <th className="px-4 py-3 text-right">Discount</th>
                                                <th className="px-4 py-3 text-center w-16">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {form.rows.map((product) => <OfferProductRow key={product.id} product={product} onRemove={form.removeProduct} />)}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sticky bottom-0 pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                        <Button variant="outline" onClick={onClose} className="px-6 h-9">Cancel</Button>
                        <Button variant="success" onClick={form.submit} className="px-8 h-9">Save</Button>
                    </div>
                </div>
    );
}

export function OffersDrawer({ manager }: { manager: OffersManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeOffer = manager.getActiveOffer() ?? null;
    const isOpen = manager.activeDrawer !== "none";

    return (
        <Drawer
            title={isEditing ? "Update Offer" : "Add Offer"}
            isOpen={isOpen}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {isOpen && <OfferFormBody key={`${manager.activeDrawer}-${activeOffer?.id ?? "new"}`} offer={isEditing ? activeOffer : null} onSubmit={manager.handleSubmit} onClose={manager.closeDrawer} />}
        </Drawer>
    );
}
