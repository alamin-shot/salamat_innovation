"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Save, CheckCircle2 } from "lucide-react";

function ShippingFormContent({ record, manager }: { record: any; manager: any }) {
    const [formData, setFormData] = useState({
        chargeType: record?.chargeType || "default",
        customAmount: record?.customAmount || 0
    });

    const handleSave = () => {
        manager.store.updateAreaShipping(record.id, formData);
        manager.setDrawerMode("none");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-4">

                {/* Interactive Radio Cards */}
                <button
                    onClick={() => setFormData({ ...formData, chargeType: "default" })}
                    className={`text-left p-4 rounded-xl border flex flex-col gap-1 transition-all ${formData.chargeType === "default" ? "bg-brand-primary/5 border-brand-primary shadow-sm" : "bg-white border-gray-200 hover:border-brand-primary/40"}`}
                >
                    <div className="flex items-center gap-2">
                        {formData.chargeType === "default" && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                        <span className={`text-sm font-bold ${formData.chargeType === "default" ? "text-brand-primary" : "text-gray-900"}`}>Use default charge</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Fall back to the Inside/Outside Dhaka City charge from Delivery Charge Settings.</p>
                </button>

                <button
                    onClick={() => setFormData({ ...formData, chargeType: "free" })}
                    className={`text-left p-4 rounded-xl border flex flex-col gap-1 transition-all ${formData.chargeType === "free" ? "bg-brand-primary/5 border-brand-primary shadow-sm" : "bg-white border-gray-200 hover:border-brand-primary/40"}`}
                >
                    <div className="flex items-center gap-2">
                        {formData.chargeType === "free" && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                        <span className={`text-sm font-bold ${formData.chargeType === "free" ? "text-brand-primary" : "text-gray-900"}`}>Free delivery</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Customers in this area will not be charged for delivery.</p>
                </button>

                <button
                    onClick={() => setFormData({ ...formData, chargeType: "custom" })}
                    className={`text-left p-4 rounded-xl border flex flex-col gap-1 transition-all ${formData.chargeType === "custom" ? "bg-brand-primary/5 border-brand-primary shadow-sm" : "bg-white border-gray-200 hover:border-brand-primary/40"}`}
                >
                    <div className="flex items-center gap-2">
                        {formData.chargeType === "custom" && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                        <span className={`text-sm font-bold ${formData.chargeType === "custom" ? "text-brand-primary" : "text-gray-900"}`}>Custom amount</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Set a specific flat delivery charge for this area.</p>

                    {/* Auto-Expanding Input */}
                    {formData.chargeType === "custom" && (
                        <div className="ml-6 mt-3 animate-in fade-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                            <label className="erp-label">Amount (BDT)</label>
                            <input type="number" className="erp-input mt-1 max-w-[150px]" value={formData.customAmount} onChange={e => setFormData({ ...formData, customAmount: Number(e.target.value) })} />
                        </div>
                    )}
                </button>

            </div>
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save Override
                </Button>
            </div>
        </div>
    );
}

export function AreaShippingDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "shipping_form";
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={manager.activeRecord?.area ? `Shipping Charge — ${manager.activeRecord.area}` : "Edit Area"}
            width="w-full sm:w-[500px]"
        >
            <ShippingFormContent key={manager.activeRecord?.id || "empty"} record={manager.activeRecord} manager={manager} />
        </Drawer>
    );
}