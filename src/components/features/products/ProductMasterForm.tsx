"use client";
import * as React from "react";
import { VariantsManager } from "@/components/features/products/VariantsManager";
import { SpecificationsForm } from "@/components/features/products/SpecificationsForm";
import { CareForm } from "@/components/features/products/CareForm";
import { WarrantyModal } from "@/components/features/products/modals/WarrantyModal";
import { ProductTagsDropdown } from "@/components/features/products/ProductTagsDropdown";
import { UploadCloud, Video } from "lucide-react";

interface ProductMasterFormProps {
    productId?: string | null;
    onCancel: () => void;
    onSave: () => void;
}

type TabType = "basic" | "variants" | "specs" | "warranty-care";

const TABS: { id: TabType; label: string }[] = [
    { id: "basic", label: "Basic Info & Media" },
    { id: "variants", label: "Variants" },
    { id: "specs", label: "Specifications" },
    { id: "warranty-care", label: "Warranty & Care" },
];

export function ProductMasterForm({ productId, onCancel, onSave }: ProductMasterFormProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>("basic");

    return (
        <div className="flex h-full flex-col">
            {/* Tab Navigation */}
            <div className="shrink-0 overflow-x-auto border-b border-brand-subtext/20 px-2 sm:px-6 custom-scrollbar">
                <nav className="flex space-x-4 sm:space-x-6" aria-label="Tabs">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors focus:outline-none ${isActive
                                        ? "border-brand-primary text-brand-primary"
                                        : "border-transparent text-brand-subtext hover:border-brand-subtext/30 hover:text-brand-text"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                <div className="mx-auto max-w-3xl">

                    {/* Basic Info & Media Tab */}
                    {activeTab === "basic" && (
                        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">

                            {/* Core Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Product Name</label>
                                    <input type="text" placeholder="e.g. vivo S2" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Base Price</label>
                                    <input type="number" placeholder="0.00" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Category</label>
                                    <select className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option>Smart Phones</option>
                                        <option>Wearables</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Brand</label>
                                    <select className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option>VIVO</option>
                                        <option>Xiaomi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">SKU (Stock Keeping Unit)</label>
                                    <input type="text" placeholder="e.g. VIV-S2-BLK" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Stock Quantity</label>
                                    <input type="number" placeholder="0" className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Short Description</label>
                                <textarea rows={3} placeholder="Briefly describe the product..." className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary custom-scrollbar" />
                            </div>

                            {/* RESTORED: Media Section */}
                            <div className="flex flex-col gap-5 rounded-xl border border-brand-subtext/20 bg-brand-bg/30 p-5">
                                <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">Media Files</h3>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Product Images (Multiple)</label>
                                    <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-white px-6 py-8 transition-colors hover:border-brand-primary/50 hover:bg-brand-primary/5">
                                        <UploadCloud className="mb-2 h-8 w-8 text-brand-subtext" />
                                        <p className="text-sm font-medium text-brand-text">Click to upload or drag & drop</p>
                                        <p className="mt-1 text-xs text-brand-subtext">SVG, PNG, JPG or GIF (max 5MB each)</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Short Video</label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                                        <input type="text" placeholder="Paste YouTube/Vimeo URL or click upload icon..." className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-9 pr-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* State & Tags */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end border-t border-brand-subtext/10 pt-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Status</label>
                                    <select className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Coming Soon</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Ecommerce</label>
                                    <select className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option>Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-brand-subtext uppercase tracking-wider mb-1">Global Tags</label>
                                    <div className="inline-block w-full">
                                        <ProductTagsDropdown productId={productId || "new"} initialTags={[]} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Variants Tab */}
                    {activeTab === "variants" && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            <VariantsManager productId={productId ?? null} />
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === "specs" && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                            <SpecificationsForm productId={productId ?? null} />
                        </div>
                    )}

                    {/* Warranty & Care Tab */}
                    {activeTab === "warranty-care" && (
                        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200">
                            <section>
                                <h3 className="mb-4 text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-2">Warranty Details</h3>
                                <WarrantyModal isEditMode={true} setIsEditMode={() => { }} productId={productId || "new"} />
                            </section>

                            <section>
                                <h3 className="mb-4 text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-2">Care Instructions</h3>
                                <CareForm productId={productId ?? null} />
                            </section>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="shrink-0 flex items-center justify-end gap-3 border-t border-brand-subtext/20 bg-white p-4 sm:px-6">
                <button
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text focus:outline-none"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="rounded-md bg-brand-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                    {productId ? "Save Changes" : "Create Product"}
                </button>
            </div>
        </div>
    );
}