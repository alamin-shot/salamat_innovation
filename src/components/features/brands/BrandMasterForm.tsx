"use client";
import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Save } from "lucide-react";
import { toast } from "sonner";

interface BrandMasterFormProps {
    brandId?: string | null;
    onCancel: () => void;
    onSave: () => void;
}

interface MediaState {
    primaryLogo: string | null;
    secondaryLogo: string | null;
    shopBanner: string | null;
    infoBanner: string | null;
}

export function BrandMasterForm({ brandId, onCancel, onSave }: BrandMasterFormProps) {
    const isEditMode = !!brandId;

    // Form Field States - strictly matching legacy fields
    const [name, setName] = React.useState(isEditMode ? "Apple" : "");
    const [tagline, setTagline] = React.useState(isEditMode ? "Think Different" : "");
    const [androidAppLink, setAndroidAppLink] = React.useState(isEditMode ? "https://play.google.com/store/apps/details?id=com.apple" : "");
    const [iosAppLink, setIosAppLink] = React.useState(isEditMode ? "https://apps.apple.com/app/id123456" : "");

    // Media Dropzone States (pre-filled in edit mode with legacy dimensions)
    const [media, setMedia] = React.useState<MediaState>({
        primaryLogo: isEditMode ? "https://placehold.co/100x100/e2e8f0/64748b?text=Ap" : null,
        secondaryLogo: isEditMode ? "https://placehold.co/100x100/e2e8f0/64748b?text=Ap" : null,
        shopBanner: isEditMode ? "https://placehold.co/100x100/e2e8f0/64748b?text=Banner" : null,
        infoBanner: isEditMode ? "https://placehold.co/100x100/e2e8f0/64748b?text=Info" : null,
    });

    const removeImage = (key: keyof MediaState) => {
        setMedia(prev => ({ ...prev, [key]: null }));
    };

    const handleMockUpload = (key: keyof MediaState) => {
        setMedia(prev => ({
            ...prev,
            [key]: "https://placehold.co/100x100/e2e8f0/64748b?text=Uploaded"
        }));
        toast.success("Image uploaded successfully.");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Brand name is required.");
            return;
        }

        toast.success(isEditMode ? "Brand updated successfully." : "Brand created successfully.");
        onSave();
    };

    const mediaSlots: { key: keyof MediaState; label: string }[] = [
        { key: "primaryLogo", label: "Primary Logo" },
        { key: "secondaryLogo", label: "Secondary Logo" },
        { key: "shopBanner", label: "Shop Banner" },
        { key: "infoBanner", label: "Info Banner" },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex h-full flex-col bg-brand-bg/30">
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mx-auto max-w-4xl flex flex-col gap-6">

                    {/* CARD 1: Basic Information */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-5">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">
                            Brand Information
                        </h3>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="Tagline"
                                className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                    Android App Link
                                </label>
                                <input
                                    type="text"
                                    value={androidAppLink}
                                    onChange={(e) => setAndroidAppLink(e.target.value)}
                                    placeholder="Android App Link"
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                    IOS App Link
                                </label>
                                <input
                                    type="text"
                                    value={iosAppLink}
                                    onChange={(e) => setIosAppLink(e.target.value)}
                                    placeholder="IOS App Link"
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Brand Media (4 exact slots from legacy design) */}
                    <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col gap-5">
                        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-subtext/10 pb-3">
                            Brand Media
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {mediaSlots.map(({ key, label }) => {
                                const currentImage = media[key];
                                return (
                                    <div key={key} className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                                            {label}
                                        </label>

                                        <div className="flex items-center gap-4">
                                            {currentImage ? (
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-brand-subtext/20 bg-brand-bg shadow-sm">
                                                    <Image
                                                        src={currentImage}
                                                        alt={label}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(key)}
                                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
                                                        title="Remove image"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => handleMockUpload(key)}
                                                    className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50"
                                                >
                                                    <UploadCloud className="h-6 w-6 text-brand-subtext" />
                                                </div>
                                            )}

                                            <div className="text-xs text-brand-subtext font-medium leading-relaxed">
                                                <p>Recommended size: 100 X 100 PX</p>
                                                <p>Max file size: 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 flex items-center justify-end gap-3 border-t border-brand-subtext/20 bg-white p-4 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-5 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-7 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" />
                    Save
                </button>
            </div>
        </form>
    );
}