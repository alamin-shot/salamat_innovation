"use client";
import * as React from "react";
import { UploadCloud, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

interface CategoryMasterFormProps {
    categoryId?: string | null;
    onSave: () => void;
}

export function CategoryMasterForm({ categoryId, onSave }: CategoryMasterFormProps) {
    const isEditMode = !!categoryId;

    // Custom Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [selectedParent, setSelectedParent] = React.useState(isEditMode ? "Mobile and Tablets" : "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(isEditMode ? "Category updated successfully." : "Category created successfully.");
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-brand-text mb-2">
                {isEditMode ? "Update Category" : "Add Category"}
            </h2>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    defaultValue={isEditMode ? "iPhone" : ""}
                    placeholder="Name"
                    required
                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Category</label>
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${isDropdownOpen ? "border-emerald-500 ring-1 ring-emerald-500" : "border-brand-subtext/30 hover:border-emerald-400"}`}
                >
                    <span className={selectedParent ? "text-brand-text font-medium" : "text-brand-subtext"}>
                        {selectedParent || "Choose a category"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-brand-subtext transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-emerald-600" : ""}`} />
                </div>

                {isDropdownOpen && (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-brand-subtext/20 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {["Mobile and Tablets", "Electronic Devices", "Wearable Technology", "Gaming"].map(cat => (
                                <div
                                    key={cat}
                                    onClick={() => { setSelectedParent(cat); setIsDropdownOpen(false); }}
                                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                >
                                    <span>{cat}</span>
                                    {selectedParent === cat && <Check className="h-4 w-4 text-emerald-600" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Exact 4 Media Zones from legacy design */}
            {[
                { label: "Logo", desc: "Recommended size: 100 X 100 PX" },
                { label: "Secondary Logo", desc: "Recommended size: 100 X 100 PX" },
                { label: "Banner", desc: "Recommended size: 100 X 100 PX" },
                { label: "Info Banner", desc: "Recommended size: 100 X 100 PX" }
            ].map((media) => (
                <div key={media.label} className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">{media.label}</label>
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50">
                            <UploadCloud className="h-6 w-6 text-brand-subtext" />
                        </div>
                        <div className="text-xs text-brand-subtext font-medium leading-relaxed">
                            <p>{media.desc}</p>
                            <p>Max file size: 2MB</p>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-4 pb-10">
                <button
                    type="submit"
                    className="rounded-md bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
}