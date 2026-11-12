"use client";
import * as React from "react";
import Image from "next/image";
import { X, UploadCloud, Save } from "lucide-react";
import { toast } from "sonner";
import { ProductPage, ProductPageInput } from "@/types/products";
import { AuditFooter } from "../shared/AuditCells";

interface PageEditFormProps {
    page: ProductPage;
    onSubmit: (updates: Partial<ProductPageInput>) => void;
    onCancel: () => void;
}

interface MediaState {
    avatar: string | null;
    secondaryLogo: string | null;
    shopBanner: string | null;
    infoBanner: string | null;
}

const MEDIA_SLOTS: { key: keyof MediaState; label: string }[] = [
    { key: "avatar", label: "Logo" },
    { key: "secondaryLogo", label: "Secondary Logo" },
    { key: "shopBanner", label: "Shop Banner" },
    { key: "infoBanner", label: "Info Banner" },
];

export function PageEditForm({ page, onSubmit, onCancel }: PageEditFormProps) {
    const [title, setTitle] = React.useState(page.title);
    const [media, setMedia] = React.useState<MediaState>({
        avatar: page.avatar,
        secondaryLogo: page.secondaryLogo,
        shopBanner: page.shopBanner,
        infoBanner: page.infoBanner,
    });

    const removeImage = (key: keyof MediaState) => {
        setMedia((prev) => ({ ...prev, [key]: null }));
    };

    const handleMockUpload = (key: keyof MediaState) => {
        setMedia((prev) => ({ ...prev, [key]: "/phone.png" }));
        toast.success("Image selected.");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title: title.trim(), ...media });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                    Title
                </label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {MEDIA_SLOTS.map(({ key, label }) => {
                    const current = media[key];
                    return (
                        <div key={key} className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                {label}
                            </label>
                            <div className="flex items-center gap-3">
                                {current ? (
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-subtext/20 bg-brand-bg">
                                        <Image src={current} alt={label} fill sizes="64px" className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(key)}
                                            className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => handleMockUpload(key)}
                                        className="flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50"
                                    >
                                        <UploadCloud className="h-5 w-5 text-brand-subtext" />
                                    </div>
                                )}

                                <div className="text-[11px] text-brand-subtext font-medium leading-relaxed">
                                    <p>Recommended size: 100 X 100 PX</p>
                                    <p>Max file size: 2MB</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AuditFooter
                createdBy={page.createdBy}
                createdAt={page.createdAt}
                updatedBy={page.updatedBy}
                updatedAt={page.updatedAt}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save
                </button>
            </div>
        </form>
    );
}
