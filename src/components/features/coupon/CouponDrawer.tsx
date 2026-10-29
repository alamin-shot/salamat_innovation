"use client";
import { useState, useEffect } from "react";
import { CouponManagerType } from "@/hooks/coupon_hooks/useCouponManager";
import { Coupon, CouponType, CouponVisibility } from "@/store/useCouponStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";

export function CouponDrawer({ manager }: { manager: CouponManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeCoupon = manager.getActiveCoupon();

    const [formData, setFormData] = useState<Omit<Coupon, "id">>({
        code: "",
        type: "all",
        targetIds: [],
        discountAmount: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        usageLimit: null,
        minPurchaseAmount: null,
        visibility: "Public",
        status: "Active"
    });

    useEffect(() => {
        if (isEditing && activeCoupon) {
            setFormData(JSON.parse(JSON.stringify(activeCoupon)));
        } else if (manager.activeDrawer === "add") {
            setFormData({
                code: "",
                type: "all",
                targetIds: [],
                discountAmount: 0,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                usageLimit: null,
                minPurchaseAmount: null,
                visibility: "Public",
                status: "Active"
            });
        }
    }, [isEditing, activeCoupon, manager.activeDrawer]);

    const handleSubmit = () => {
        if (!formData.code.trim()) return alert("Coupon Code is required");
        if (formData.discountAmount <= 0) return alert("Discount Amount must be greater than 0");
        manager.handleSubmit(formData);
    };

    return (
        <Drawer
            title={isEditing ? "Update Coupon" : "Add Coupon"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Coupon Type <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.type}
                                options={["all", "brand", "product", "pre_owned"]}
                                onChange={(val) => setFormData({ ...formData, type: val as CouponType, targetIds: [] })}
                            />
                        </div>

                        {/* Conditional Targeting Fields */}
                        {formData.type === "brand" && (
                            <div className="flex flex-col gap-1.5 sm:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <label className="erp-label">Select Brands</label>
                                <CustomSelect
                                    value={formData.targetIds?.[0] || ""}
                                    options={["Apple", "Samsung", "Xiaomi", "OnePlus"]}
                                    onChange={(val) => setFormData({ ...formData, targetIds: [val] })}
                                    placeholder="Choose brands this applies to..."
                                />
                                <span className="text-xs text-gray-500 mt-1">Customers can only use this coupon on products from these brands.</span>
                            </div>
                        )}

                        {formData.type === "product" && (
                            <div className="flex flex-col gap-1.5 sm:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <label className="erp-label">Select Products</label>
                                <CustomSelect
                                    value={formData.targetIds?.[0] || ""}
                                    options={["iPhone 16 Pro", "Galaxy S24 Ultra", "Pixel 9 Pro"]}
                                    onChange={(val) => setFormData({ ...formData, targetIds: [val] })}
                                    placeholder="Choose specific products..."
                                />
                                <span className="text-xs text-gray-500 mt-1">Customers can only use this coupon on these exact products.</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Code <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input uppercase"
                                placeholder="e.g. SUMMER2026"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Discount Value <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                className="erp-input"
                                placeholder="Amount in BDT"
                                value={formData.discountAmount || ""}
                                onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

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
                            <label className="erp-label">Usage Limit</label>
                            <input
                                type="number"
                                className="erp-input"
                                placeholder="Leave blank for unlimited"
                                value={formData.usageLimit || ""}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Minimum Purchase Amount</label>
                            <input
                                type="number"
                                className="erp-input"
                                placeholder="e.g. 5000"
                                value={formData.minPurchaseAmount || ""}
                                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value ? parseFloat(e.target.value) : null })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Visibility <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.visibility}
                                options={["Public", "Private"]}
                                onChange={(val) => setFormData({ ...formData, visibility: val as CouponVisibility })}
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