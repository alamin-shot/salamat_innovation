"use client";
import * as React from "react";
import { UploadCloud, ChevronDown, Check, Save } from "lucide-react";
import { toast } from "sonner";
import { VariantsManager } from "./VariantsManager";

interface ProductMasterFormProps {
    productId?: string | null;
    onCancel: () => void;
    onSave: () => void;
}

export function ProductMasterForm({ productId, onCancel, onSave }: ProductMasterFormProps) {
    const isEditMode = !!productId;

    // Dropdown States
    const [activeDropdown, setActiveDropdown] = React.useState<"brand" | "category" | null>(null);
    const [selectedBrand, setSelectedBrand] = React.useState(isEditMode ? "Apple" : "");
    const [selectedCategory, setSelectedCategory] = React.useState(isEditMode ? "Smart Phones" : "");

    // Warranty Toggles
    const [hasWarrantyText, setHasWarrantyText] = React.useState(false);
    const [hasServiceWarranty, setHasServiceWarranty] = React.useState(false);

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
        toast.success(isEditMode ? "Product updated successfully." : "Product created successfully.");
        onSave();
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex h-full flex-col bg-brand-bg/30">
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mx-auto max-w-5xl flex flex-col gap-6">

                    {/* CARD 1: PRODUCT INFORMATION */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Name <span className="text-red-500">*</span></label>
                                <input type="text" defaultValue={isEditMode ? "iPhone 13 Pro" : ""} placeholder="Name" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Headline</label>
                                <input type="text" placeholder="Headline" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>

                            {/* CUSTOM BRAND DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Brand <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "brand" ? null : "brand")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "brand" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedBrand ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedBrand || "Choose a Brand"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "brand" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>

                                {activeDropdown === "brand" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {["Apple", "VIVO", "Samsung", "Xiaomi"].map(brand => (
                                                <div
                                                    key={brand}
                                                    onClick={() => { setSelectedBrand(brand); setActiveDropdown(null); }}
                                                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <span>{brand}</span>
                                                    {selectedBrand === brand && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM CATEGORY DROPDOWN */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                                <div
                                    onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${activeDropdown === "category" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                                >
                                    <span className={selectedCategory ? "text-brand-text font-medium" : "text-brand-subtext"}>
                                        {selectedCategory || "Choose a category"}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${activeDropdown === "category" ? "rotate-180 text-emerald-600" : ""}`} />
                                </div>

                                {activeDropdown === "category" && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                            {["Smart Phones", "Accessories", "Tablets", "Wearables"].map(cat => (
                                                <div
                                                    key={cat}
                                                    onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                                                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <span>{cat}</span>
                                                    {selectedCategory === cat && <Check className="h-4 w-4 text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Key Features</label>
                            <div className="rounded-md border border-brand-subtext/30 bg-white overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                                <div className="flex items-center gap-3 border-b border-brand-subtext/20 bg-brand-bg/30 px-3 py-2 text-brand-subtext">
                                    <span className="text-xs font-medium pr-2 border-r border-brand-subtext/20">Normal</span>
                                    <span className="font-serif font-bold cursor-pointer hover:text-brand-text transition-colors">B</span>
                                    <span className="font-serif italic cursor-pointer hover:text-brand-text transition-colors">I</span>
                                    <span className="font-serif underline cursor-pointer hover:text-brand-text transition-colors">U</span>
                                </div>
                                <textarea rows={4} placeholder="Enter key features..." className="w-full resize-none p-3 text-sm text-brand-text focus:outline-none custom-scrollbar"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: PRODUCT IMAGE & VIDEO LINKS */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Image & Video</h3>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Thumbnail Image</label>
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
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Video Links</label>
                            <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-600/40 bg-emerald-50/30 py-6 transition-colors hover:border-emerald-600/70 hover:bg-emerald-50">
                                <UploadCloud className="mb-2 h-6 w-6 text-emerald-600" />
                                <span className="text-sm font-bold text-brand-text">Drop files here or click to upload</span>
                                <span className="text-xs font-medium text-emerald-600 mt-1">Upload Files</span>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: LOGISTICS & WARRANTY */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Logistics & Warranty</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Booking Money</label>
                                <input type="number" placeholder="Booking Money" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Purchase Point</label>
                                <input type="number" placeholder="Purchase Point" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Warranty Day</label>
                            <input type="text" placeholder="Warranty Day" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>

                        <div className="flex flex-col gap-3 rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4 transition-all">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider cursor-pointer" onClick={() => setHasWarrantyText(!hasWarrantyText)}>Warranty Text</label>
                                <label className="flex cursor-pointer items-center">
                                    <input type="checkbox" checked={hasWarrantyText} onChange={(e) => setHasWarrantyText(e.target.checked)} className="peer sr-only" />
                                    <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative shadow-sm"></div>
                                </label>
                            </div>
                            {hasWarrantyText && (
                                <textarea rows={3} placeholder="Warranty will be applicable for..." className="w-full resize-none rounded-md border border-brand-subtext/30 bg-white p-3 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 custom-scrollbar animate-in slide-in-from-top-2 fade-in duration-200"></textarea>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4 transition-all">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider cursor-pointer" onClick={() => setHasServiceWarranty(!hasServiceWarranty)}>Service Warranty</label>
                                <label className="flex cursor-pointer items-center">
                                    <input type="checkbox" checked={hasServiceWarranty} onChange={(e) => setHasServiceWarranty(e.target.checked)} className="peer sr-only" />
                                    <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative shadow-sm"></div>
                                </label>
                            </div>
                            {hasServiceWarranty && (
                                <input type="text" placeholder="Service Warranty" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 animate-in slide-in-from-top-2 fade-in duration-200" />
                            )}
                        </div>
                    </div>

                    {/* CARD 4: PRODUCT VARIANTS */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">Product Variants</h3>
                        <div className="pt-2">
                            <VariantsManager productId={productId} isQuickEdit={false} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 flex items-center justify-end gap-4 border-t border-brand-subtext/20 bg-white p-4 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button type="button" onClick={onCancel} className="rounded-md px-6 py-2.5 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors">
                    Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 rounded-md bg-[#F59E0B] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#D97706]">
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Update Product" : "Save"}
                </button>
            </div>
        </form>
    );
}