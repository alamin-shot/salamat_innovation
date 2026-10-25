"use client";
import { useSharedSeoForm } from "@/hooks/seo_hooks/useSharedSeoForm";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { X } from "lucide-react";
import { SeoTabType } from "@/store/useSeoStore";

export function SharedSeoFormModal({
    isOpen,
    onClose,
    form,
    tab
}: {
    isOpen: boolean;
    onClose: () => void;
    form: ReturnType<typeof useSharedSeoForm>;
    tab: SeoTabType;
}) {
    if (!isOpen) return null;

    const isEdit = Boolean(form.name); // Simple check if we are editing
    const singularTabName = tab.endsWith('s') ? tab.slice(0, -1) : tab;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 capitalize">
                        {isEdit ? "Manage SEO" : `Add ${singularTabName}`}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 flex-1">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Name <span className="text-red-500">*</span></label>
                        <input type="text" value={form.name} onChange={(e) => form.setName(e.target.value)} className="erp-input" placeholder="e.g. Featured" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Slug <span className="text-red-500">*</span></label>
                        <input type="text" value={form.slug} onChange={(e) => form.setSlug(e.target.value)} className="erp-input" placeholder="e.g. featured" />
                    </div>

                    {/* Only show Category and Brand dropdowns if on the Products tab */}
                    {tab === "products" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Category</label>
                                <CustomSelect value={form.productCategory} onChange={form.setProductCategory} options={["Smart Phones", "Bluetooth Finder", "Microphone"]} placeholder="Select Category" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Brand</label>
                                <CustomSelect value={form.productBrand} onChange={form.setProductBrand} options={["Apple", "Xiaomi", "Honor", "ONEPLUS", "WiWu"]} placeholder="Select Brand" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Description</label>
                        {/* Placeholder for actual Rich Text Editor component */}
                        <div className="border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-emerald-500 transition-colors">
                            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-3 text-gray-500 text-sm">
                                <span className="font-medium text-gray-700">Normal</span>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <span className="font-bold cursor-pointer hover:text-gray-800">B</span>
                                <span className="italic cursor-pointer hover:text-gray-800">I</span>
                                <span className="underline cursor-pointer hover:text-gray-800">U</span>
                                <span className="line-through cursor-pointer hover:text-gray-800">S</span>
                            </div>
                            <textarea
                                value={form.description}
                                onChange={(e) => form.setDescription(e.target.value)}
                                rows={4}
                                className="w-full p-3 text-[13px] outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Meta Title</label>
                        <input type="text" value={form.metaTitle} onChange={(e) => form.setMetaTitle(e.target.value)} className="erp-input" placeholder="Meta Title" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Meta Description</label>
                        <textarea value={form.metaDescription} onChange={(e) => form.setMetaDescription(e.target.value)} rows={3} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none resize-none" placeholder="Meta Description" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Meta Tag (separate with comma)</label>
                        <textarea value={form.metaTags} onChange={(e) => form.setMetaTags(e.target.value)} rows={2} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none resize-none" placeholder="Meta Tag(separate with comma)" />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 h-9 font-medium bg-white">Cancel</Button>
                    <Button type="button" variant="success" onClick={form.handleSave} className="px-8 h-9 font-medium">Save</Button>
                </div>

            </div>
        </div>
    );
}