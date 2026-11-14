"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Link2, Video } from "lucide-react";
import { ReelsManagerType } from "@/hooks/reels_hooks/useReelsManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ReelInput, ReelRecord } from "@/types/reels";
import { parseVideoLink, VIDEO_LINK_LABEL } from "@/utils/videoLinks";

// Dummy product list for the dropdown (unchanged)
const PRODUCT_OPTIONS = [
    "Choose a product",
    "iPhone 17 Pro Max",
    "JBL Tune 770NC",
    "VOLTME Powerlink Utron Series C to C",
    "VOLTME Hypercore 10K LED Rollz",
];
const STATUS_OPTIONS = ["Active", "Inactive"];

function ReelForm({ reel, onSubmit, onClose }: { reel: ReelRecord | null; onSubmit: (data: ReelInput) => void; onClose: () => void }) {
    const [productName, setProductName] = useState(reel?.productName ?? PRODUCT_OPTIONS[0]);
    const [videoLink, setVideoLink] = useState(reel?.videoLink ?? "");
    const [status, setStatus] = useState<ReelInput["status"]>(reel?.status ?? "Active");

    const link = videoLink.trim();
    const info = parseVideoLink(link);

    const handleSubmit = () => {
        if (productName === PRODUCT_OPTIONS[0]) return toast.error("Please select a product.");
        if (link && info.kind === "invalid") return toast.error("Enter a YouTube, Facebook or direct video (.mp4 / .webm) link.");
        onSubmit({ productName, videoLink: link || null, status });
    };

    // Products of existing reels stay selectable even if they are not in the short list.
    const productOptions = PRODUCT_OPTIONS.includes(productName) ? PRODUCT_OPTIONS : [...PRODUCT_OPTIONS, productName];

    return (
        <div className="flex min-h-full flex-col pt-6">
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2 pb-32">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Product <span className="text-red-500">*</span></label>
                    <CustomSelect value={productName} onChange={setProductName} options={productOptions} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Video link</label>
                    <div className={`flex flex-col gap-3 rounded-lg border-2 border-dashed p-6 transition-colors ${link && info.kind !== "invalid" ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200 bg-gray-50"}`}>
                        <div className="relative">
                            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                                placeholder="https://youtube.com/watch?v=…  ·  facebook.com/…/videos/…  ·  https://…/reel.mp4"
                                className="erp-input w-full pl-9"
                            />
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${!link ? "text-gray-500" : info.kind === "invalid" ? "text-rose-600" : "text-emerald-700"}`}>
                            <Video className="h-3.5 w-3.5" />
                            {link ? VIDEO_LINK_LABEL[info.kind] : "Paste a YouTube, Facebook or direct video link (uploads arrive with media storage)."}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Status</label>
                    <CustomSelect value={status} onChange={(value) => setStatus(value === "Inactive" ? "Inactive" : "Active")} options={STATUS_OPTIONS} />
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white pt-4">
                <Button variant="outline" onClick={onClose} className="h-9 px-6">Cancel</Button>
                <Button variant="success" onClick={handleSubmit} className="h-9 px-8">Save</Button>
            </div>
        </div>
    );
}

export function ReelsDrawer({ manager }: { manager: ReelsManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const isOpen = manager.activeDrawer === "add" || isEditing;
    const reel = isEditing ? manager.getActiveReel() ?? null : null;

    return (
        <Drawer title={isEditing ? "Update Reels Video" : "Add Reels Video"} isOpen={isOpen} onClose={manager.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            {isOpen && <ReelForm key={`${manager.activeDrawer}-${reel?.id ?? "new"}`} reel={reel} onSubmit={manager.handleFormSubmit} onClose={manager.closeDrawer} />}
        </Drawer>
    );
}
