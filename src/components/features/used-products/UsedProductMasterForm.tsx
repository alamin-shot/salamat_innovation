"use client";
import * as React from "react";
import Image from "next/image";
import { UploadCloud, Trash2, ChevronDown, Save, Check, X } from "lucide-react";
import { toast } from "sonner";

interface UsedProductMasterFormProps {
    productId?: string | null;
    onCancel: () => void;
    onSave: () => void;
}

export function UsedProductMasterForm({ productId, onCancel, onSave }: UsedProductMasterFormProps) {
    const isEditMode = !!productId;

    // Dropdown States
    const [activeDropdown, setActiveDropdown] = React.useState<"product" | "variant" | "discountType" | null>(null);
    const [selectedProduct, setSelectedProduct] = React.useState(isEditMode ? "iPhone 13 Pro" : "");
    const [selectedVariant, setSelectedVariant] = React.useState(isEditMode ? "Gold / 128GB" : "");
    const [selectedDiscountType, setSelectedDiscountType] = React.useState("Fixed");

    // Dynamic Attributes State
    const [attributes, setAttributes] = React.useState([{ id: 1, name: "Color", value: "Gold" }]);
    const addAttribute = () => setAttributes([...attributes, { id: Date.now(), name: "", value: "" }]);
    const removeAttribute = (id: number) => setAttributes(attributes.filter(a => a.id !== id));

    // Attachments State
    const [attachments, setAttachments] = React.useState([1, 2, 3, 4, 5]); // Mock IDs for the preview grid
    const removeAttachment = (id: number) => setAttachments(attachments.filter(aId => aId !== id));

    // Click outside handler for dropdowns
    const formRef = React.useRef<HTMLFormElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(isEditMode ? "Used product updated successfully." : "Used product created successfully.");
        onSave();
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mx-auto max-w-5xl flex flex-col gap-8">

                    {/* CARD 1: Core Identifiers */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Core Identifiers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* CUSTOM PRODUCT DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-semibold text-brand-text">Product <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "product" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedProduct ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedProduct || "Choose a product"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "product" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>
                                {activeDropdown === "product" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {["iPhone 13 Pro", "iPhone 14 Pro", "Samsung S23 Ultra"].map(prod => (
                                                <div key={prod} onClick={() => { setSelectedProduct(prod); setActiveDropdown(null); }} className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                    <span>{prod}</span>
                                                    {selectedProduct === prod && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM VARIANT DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-semibold text-brand-text">Variant <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "variant" ? null : "variant")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "variant" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedVariant ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedVariant || "Choose a Attribute"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "variant" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>
                                {activeDropdown === "variant" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {["Gold / 128GB", "Gold / 256GB", "Sierra Blue / 128GB"].map(vrnt => (
                                                <div key={vrnt} onClick={() => { setSelectedVariant(vrnt); setActiveDropdown(null); }} className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                    <span>{vrnt}</span>
                                                    {selectedVariant === vrnt && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Serial Number <span className="text-red-500">*</span></label>
                                <input type="text" defaultValue={isEditMode ? "359052378710667" : ""} placeholder="Enter serial number" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono" required />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Pricing & Health */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Pricing & Health Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Price <span className="text-red-500">*</span></label>
                                <input type="number" defaultValue={isEditMode ? "53990.00" : ""} placeholder="Enter price" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
                            </div>

                            {/* CUSTOM DISCOUNT TYPE DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-semibold text-brand-text">Discount Type</label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "discountType" ? null : "discountType")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "discountType" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className="text-brand-text font-medium">{selectedDiscountType}</span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "discountType" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>
                                {activeDropdown === "discountType" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1">
                                            {["Fixed", "Percentage"].map(type => (
                                                <div key={type} onClick={() => { setSelectedDiscountType(type); setActiveDropdown(null); }} className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                    <span>{type}</span>
                                                    {selectedDiscountType === type && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Discount Amount</label>
                                <input type="number" defaultValue={isEditMode ? "0.00" : ""} placeholder="Discount Amount" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Battery Health (%)</label>
                                <input type="text" defaultValue={isEditMode ? "90" : ""} placeholder="Enter battery health" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Logistics & Box */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-subtext uppercase tracking-wider mb-4">Logistics & Box Availability</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Booking Amount</label>
                                <input type="number" defaultValue={isEditMode ? "2000.00" : ""} placeholder="Enter booking amount" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-text">Purchase Point</label>
                                <input type="number" defaultValue={isEditMode ? "200" : ""} placeholder="Enter purchase point" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
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
                        {/* Dropdown states for attributes (Add to top of component if needed, or inline) */}
                        {attributes.map((attr) => (
                            <div key={attr.id} className="grid grid-cols-12 gap-4 items-start">
                                {/* ATTRIBUTE NAME DROPDOWN */}
                                <div className="col-span-5 relative">
                                    <div
                                        onClick={() => setActiveDropdown(activeDropdown === `attr-name-${attr.id}` ? null : `attr-name-${attr.id}` as any)}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === `attr-name-${attr.id}` ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                    >
                                        <span className={attr.name ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                            {attr.name || "Choose an Attribute"}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === `attr-name-${attr.id}` ? "rotate-180 text-emerald-600" : ""}`} />
                                    </div>
                                    {activeDropdown === `attr-name-${attr.id}` && (
                                        <div className="absolute left-0 top-[calc(100%+4px)] z-[100] w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                            <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                {["Color", "Condition", "Region", "Carrier"].map(opt => (
                                                    <div key={opt} onClick={() => { setAttributes(attributes.map(a => a.id === attr.id ? { ...a, name: opt } : a)); setActiveDropdown(null); }} className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                        <span>{opt}</span>
                                                        {attr.name === opt && <Check className="h-4 w-4 text-emerald-600" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ATTRIBUTE VALUE DROPDOWN */}
                                <div className="col-span-6 relative">
                                    <div
                                        onClick={() => setActiveDropdown(activeDropdown === `attr-val-${attr.id}` ? null : `attr-val-${attr.id}` as any)}
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === `attr-val-${attr.id}` ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                    >
                                        <span className={attr.value ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                            {attr.value || "Choose a Value"}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === `attr-val-${attr.id}` ? "rotate-180 text-emerald-600" : ""}`} />
                                    </div>
                                    {activeDropdown === `attr-val-${attr.id}` && (
                                        <div className="absolute left-0 top-[calc(100%+4px)] z-[100] w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                            <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                {["Gold", "Silver", "Excellent", "Like New", "USA", "Global"].map(opt => (
                                                    <div key={opt} onClick={() => { setAttributes(attributes.map(a => a.id === attr.id ? { ...a, value: opt } : a)); setActiveDropdown(null); }} className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                                        <span>{opt}</span>
                                                        {attr.value === opt && <Check className="h-4 w-4 text-emerald-600" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                <div className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50 cursor-pointer overflow-hidden group">
                                    {isEditMode ? (
                                        <>
                                            <Image src="/phone.png" alt="Thumbnail" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <UploadCloud className="h-6 w-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <UploadCloud className="h-6 w-6 text-brand-subtext mb-1" />
                                    )}
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

                            {/* ATTACHMENTS PREVIEW GRID */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-4 mt-3">
                                    {attachments.map((id) => (
                                        <div key={id} className="relative h-20 w-20 rounded-md border border-brand-subtext/20 bg-brand-bg overflow-visible shrink-0 shadow-sm transition-transform hover:scale-105">
                                            <Image src={`/phone.png${id}`} alt="Attachment" fill className="rounded-md object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(id)}
                                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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