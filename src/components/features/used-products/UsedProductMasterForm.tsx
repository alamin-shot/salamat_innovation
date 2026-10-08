"use client";
import * as React from "react";
import { UploadCloud, Plus, Trash2, ChevronDown, Save, X } from "lucide-react";
import { toast } from "sonner";

interface UsedProductMasterFormProps {
    productId?: string | null;
    onCancel: () => void;
    onSave: () => void;
}

export function UsedProductMasterForm({ productId, onCancel, onSave }: UsedProductMasterFormProps) {
    const [attributes, setAttributes] = React.useState([
        { id: 1, name: "Color", value: "Gold" }
    ]);

    const addAttribute = () => setAttributes([...attributes, { id: Date.now(), name: "", value: "" }]);
    const removeAttribute = (id: number) => setAttributes(attributes.filter(a => a.id !== id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(productId ? "Used product updated successfully." : "Used product created successfully.");
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mx-auto max-w-5xl flex flex-col gap-8">

                    {/* CARD 1: Core Identifiers */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Core Identifiers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Product <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type="text" defaultValue={productId ? "iPhone 13 Pro" : ""} placeholder="Choose a product" className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-3 pr-8 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                    <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Variant <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type="text" defaultValue={productId ? "Gold / 128GB" : ""} placeholder="Choose a Variant" className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-3 pr-8 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                    <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Serial Number <span className="text-red-500">*</span></label>
                                <input type="text" defaultValue={productId ? "359052378710667" : ""} placeholder="Enter serial number" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Pricing & Health */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Pricing & Health Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Price <span className="text-red-500">*</span></label>
                                <input type="number" defaultValue={productId ? "53990.00" : ""} placeholder="Enter price" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Discount Type</label>
                                <select className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                    <option>Fixed</option>
                                    <option>Percentage</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Discount Amount</label>
                                <input type="number" defaultValue={productId ? "0.00" : ""} placeholder="Discount Amount" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Battery Health (%)</label>
                                <input type="text" defaultValue={productId ? "90" : ""} placeholder="Enter battery health" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Logistics & Box */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Logistics & Box Availability</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Booking Amount</label>
                                <input type="number" defaultValue={productId ? "2000.00" : ""} placeholder="Enter booking amount" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Purchase Point</label>
                                <input type="number" defaultValue={productId ? "200" : ""} placeholder="Enter purchase point" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Box Available</label>
                                <div className="flex items-center gap-6 h-[38px]">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="boxAvailable" className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" />
                                        <span className="text-sm font-medium text-brand-text">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="boxAvailable" defaultChecked className="h-4 w-4 text-emerald-600 focus:ring-emerald-600" />
                                        <span className="text-sm font-medium text-brand-text">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Warranty & Service */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Warranty & Performance Specs</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Charging Time</label>
                                <input type="text" placeholder="Enter charging time" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Official Service Warranty</label>
                                <input type="text" placeholder="Enter Official Service warranty" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 5: Dynamic Attributes */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Product Attributes</h3>
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-brand-subtext uppercase tracking-wider mb-1">
                            <div className="col-span-5">Attribute Name <span className="text-red-500">*</span></div>
                            <div className="col-span-6">Attribute Value <span className="text-red-500">*</span></div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>
                        {attributes.map((attr) => (
                            <div key={attr.id} className="grid grid-cols-12 gap-4 items-start">
                                <div className="col-span-5 relative">
                                    <input type="text" defaultValue={attr.name} placeholder="Choose an Attribute" className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-3 pr-8 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                    <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext pointer-events-none" />
                                </div>
                                <div className="col-span-6 relative">
                                    <input type="text" defaultValue={attr.value} placeholder="Choose a Value" className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-3 pr-8 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                    <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext pointer-events-none" />
                                </div>
                                <div className="col-span-1 flex justify-center pt-2">
                                    <button type="button" onClick={() => removeAttribute(attr.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div>
                            <button type="button" onClick={addAttribute} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition-colors">
                                Add Another Option
                            </button>
                        </div>
                    </div>

                    {/* CARD 6: Media & Rich Text */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Media & Description</h3>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-brand-text">Thumbnail Image</label>
                            <div className="flex items-center gap-4">
                                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50 cursor-pointer">
                                    <UploadCloud className="h-6 w-6 text-brand-subtext mb-1" />
                                </div>
                                <div className="text-xs text-brand-subtext font-medium leading-relaxed">
                                    <p>Recommended size 800×600</p>
                                    <p>Max file size: 2MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-brand-text">Description</label>
                            <div className="rounded-md border border-brand-subtext/30 bg-white overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                                <div className="flex items-center gap-3 border-b border-brand-subtext/20 bg-brand-bg/30 px-3 py-2 text-brand-subtext">
                                    <span className="text-xs font-medium pr-2 border-r border-brand-subtext/20">Normal</span>
                                    <span className="font-serif font-bold cursor-pointer hover:text-brand-text">B</span>
                                    <span className="font-serif italic cursor-pointer hover:text-brand-text">I</span>
                                    <span className="font-serif underline cursor-pointer hover:text-brand-text">U</span>
                                </div>
                                <textarea rows={4} placeholder="Enter description..." className="w-full resize-none p-3 text-sm text-brand-text focus:outline-none custom-scrollbar" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-brand-text">Attachments</label>
                            <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-600/40 bg-emerald-50/30 py-8 transition-colors hover:border-emerald-600/70 hover:bg-emerald-50">
                                <UploadCloud className="mb-2 h-8 w-8 text-emerald-600" />
                                <span className="text-sm font-bold text-brand-text">Drop files here or click to upload</span>
                                <span className="text-xs font-medium text-emerald-600 mt-1">Upload Files</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 flex items-center justify-end gap-3 border-t border-brand-subtext/20 bg-white p-4 sm:px-6">
                <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text">Cancel</button>
                <button type="submit" className="flex items-center gap-2 rounded-md bg-emerald-600 px-8 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700">
                    <Save className="h-4 w-4" /> Submit
                </button>
            </div>
        </form>
    );
}