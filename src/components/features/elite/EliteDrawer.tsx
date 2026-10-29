"use client";
import { useState, useEffect } from "react";
import { EliteManagerType } from "@/hooks/elite_hooks/useEliteManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { EliteTier } from "@/store/useEliteStore";
import { UploadCloud, Image as ImageIcon, Trash2, Plus } from "lucide-react";

export function EliteDrawer({ manager }: { manager: EliteManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeTier = manager.getActiveTier();

    const [formData, setFormData] = useState<Omit<EliteTier, "id">>({
        name: "",
        tagline: "",
        points: 0,
        logo: null,
        banner: null,
        benefits: [""]
    });

    // Hydrate form when switching to edit mode
    useEffect(() => {
        if (isEditing && activeTier) {
            setFormData({
                name: activeTier.name,
                tagline: activeTier.tagline,
                points: activeTier.points,
                logo: activeTier.logo,
                banner: activeTier.banner,
                benefits: activeTier.benefits.length > 0 ? [...activeTier.benefits] : [""]
            });
        } else if (manager.activeDrawer === "add") {
            setFormData({
                name: "",
                tagline: "",
                points: 0,
                logo: null,
                banner: null,
                benefits: [""]
            });
        }
    }, [isEditing, activeTier, manager.activeDrawer]);

    // Dynamic Array Handlers
    const addBenefit = () => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ""] }));

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const removeBenefit = (index: number) => {
        const newBenefits = formData.benefits.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert("Status Name is required");
            return;
        }
        // Clean out empty benefits before saving
        const cleanedData = {
            ...formData,
            benefits: formData.benefits.filter(b => b.trim() !== "")
        };
        manager.handleFormSubmit(cleanedData);
    };

    return (
        <Drawer
            title={isEditing ? "Update Elite" : "Add Elite"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-6 px-2 overflow-y-auto custom-scrollbar pb-10">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Status Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. Platinum"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Tagline</label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. Pinch Your Pennies"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Logo</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 cursor-pointer transition-colors">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Banner</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 cursor-pointer transition-colors">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Point Requirement</label>
                            <input
                                type="number"
                                className="erp-input h-24 text-center text-xl font-bold"
                                value={formData.points || ""}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-2" />

                    {/* Dynamic Benefits Section */}
                    <div className="flex flex-col gap-4">
                        <label className="erp-label font-bold text-gray-900">Add Benefits</label>

                        <div className="flex flex-col gap-3">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="erp-input flex-1"
                                        placeholder="Write a benefit..."
                                        value={benefit}
                                        onChange={(e) => updateBenefit(index, e.target.value)}
                                    />
                                    <Button
                                        variant="destructive-ghost"
                                        size="icon"
                                        onClick={() => removeBenefit(index)}
                                        disabled={formData.benefits.length === 1}
                                        className="shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="secondary"
                            className="w-fit gap-2 mt-2"
                            onClick={addBenefit}
                        >
                            <Plus className="h-4 w-4" /> Add another Benefit
                        </Button>
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