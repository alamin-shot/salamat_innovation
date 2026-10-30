"use client";
import { useState, useEffect } from "react";
import { GiftManagerType } from "@/hooks/gift_hooks/useGiftManager";
import { GiftRule } from "@/store/useGiftStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { Link } from "lucide-react";

export function GiftDrawer({ manager }: { manager: GiftManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeGift = manager.getActiveGift();

    const [formData, setFormData] = useState<Omit<GiftRule, "id">>({
        primaryProductId: "",
        primaryProductName: "",
        giftProductId: "",
        giftProductName: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: "Active"
    });

    useEffect(() => {
        if (isEditing && activeGift) {
            setFormData(JSON.parse(JSON.stringify(activeGift)));
        } else if (manager.activeDrawer === "add") {
            setFormData({
                primaryProductId: "",
                primaryProductName: "",
                giftProductId: "",
                giftProductName: "",
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                status: "Active"
            });
        }
    }, [isEditing, activeGift, manager.activeDrawer]);

    const handleSubmit = () => {
        manager.handleSubmit(formData);
    };

    return (
        <Drawer
            title={isEditing ? "Update Gift Rule" : "Add Gift Rule"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-8 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Relational Mapping Section */}
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10">
                        <div className="md:col-span-5 flex flex-col gap-1.5 w-full">
                            <label className="erp-label">Primary Product (Customer Buys) <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.primaryProductName}
                                options={["Samsung Galaxy S24 Ultra", "iPhone 15 Pro Max", "Pixel 8 Pro"]}
                                onChange={(val) => setFormData({
                                    ...formData,
                                    primaryProductName: val,
                                    primaryProductId: `mock_prod_${val.replace(/\s+/g, '').toLowerCase()}`
                                })}
                                placeholder="Select primary product..."
                            />
                        </div>

                        <div className="md:col-span-1 flex justify-center py-2">
                            <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Link className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="md:col-span-5 flex flex-col gap-1.5 w-full">
                            <label className="erp-label">Gift Product (Customer Gets) <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.giftProductName}
                                options={["Galaxy Buds 2 Pro", "Apple MagSafe Charger", "Pixel Stand 2", "Free Screen Protector"]}
                                onChange={(val) => setFormData({
                                    ...formData,
                                    giftProductName: val,
                                    giftProductId: `mock_gift_${val.replace(/\s+/g, '').toLowerCase()}`
                                })}
                                placeholder="Select gift product..."
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Settings Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Start Date <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">End Date <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Status <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.status}
                                options={["Active", "Inactive"]}
                                onChange={(val) => setFormData({ ...formData, status: val as any })}
                            />
                        </div>
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save</Button>
                </div>
            </div>
        </Drawer>
    );
}