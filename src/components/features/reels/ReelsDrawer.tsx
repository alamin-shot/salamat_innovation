"use client";
import { useState, useEffect } from "react";
import { ReelsManagerType } from "@/hooks/reels_hooks/useReelsManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ReelStatus, ReelRecord } from "@/store/useReelsStore";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

// Dummy product list for the dropdown
const PRODUCT_OPTIONS = [
    "Choose a product",
    "iPhone 17 Pro Max",
    "JBL Tune 770NC",
    "VOLTME Powerlink Utron Series C to C",
    "VOLTME Hypercore 10K LED Rollz"
];
const STATUS_OPTIONS = ["Active", "Inactive"];

export function ReelsDrawer({ manager }: { manager: ReelsManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeReel = manager.getActiveReel();

    const [formData, setFormData] = useState<Omit<ReelRecord, "id">>({
        productName: PRODUCT_OPTIONS[0],
        videoLink: null,
        status: "Active"
    });

    // Hydrate form when switching to edit mode
    useEffect(() => {
        if (isEditing && activeReel) {
            setFormData({
                productName: activeReel.productName,
                videoLink: activeReel.videoLink,
                status: activeReel.status
            });
        } else if (manager.activeDrawer === "add") {
            setFormData({
                productName: PRODUCT_OPTIONS[0],
                videoLink: null,
                status: "Active"
            });
        }
    }, [isEditing, activeReel, manager.activeDrawer]);

    const handleSubmit = () => {
        if (formData.productName === PRODUCT_OPTIONS[0]) {
            alert("Please select a product");
            return;
        }
        manager.handleFormSubmit(formData);
    };

    return (
        <Drawer
            title={isEditing ? "Update Reels Video" : "Add Reels Video"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col gap-6">

                    {/* Product Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Product <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={formData.productName}
                            onChange={(val) => setFormData({ ...formData, productName: val as string })}
                            options={PRODUCT_OPTIONS}
                        />
                    </div>

                    {/* Video Link / Upload Area */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">video_link</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer">
                            {formData.videoLink ? (
                                <>
                                    <ImageIcon className="h-8 w-8 text-emerald-500" />
                                    <span className="text-xs text-emerald-700 font-medium truncate max-w-xs">{formData.videoLink}</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="h-8 w-8 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">Click to upload video cover/link</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Status</label>
                        <CustomSelect
                            value={formData.status}
                            onChange={(val) => setFormData({ ...formData, status: val as ReelStatus })}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">
                        Save
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}