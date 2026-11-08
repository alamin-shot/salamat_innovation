"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Save, ImagePlus } from "lucide-react";
import { PaymentMethodRecord } from "@/types/settings";

function PaymentFormContent({ record, manager }: { record: PaymentMethodRecord | null; manager: any }) {
    const [formData, setFormData] = useState({
        name: record?.name || "",
        director: record?.director || "",
    });

    const handleSave = () => {
        if (record?.id) manager.store.updatePaymentMethod(record.id, formData);
        else manager.store.addPaymentMethod(formData);
        manager.setDrawerMode("none");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* LEAK 4 SEALED: pb-32 to prevent dropdown clipping */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-6">

                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Payment Method Name <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input font-bold text-gray-900" placeholder="e.g. Bkash, City Bank POS" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Assigned Director</label>
                            <CustomSelect
                                value={formData.director}
                                onChange={val => setFormData({ ...formData, director: val as string })}
                                options={[
                                    { label: "Atick Hasan Sajib", value: "Atick Hasan Sajib" },
                                    { label: "Mohammadun Nabi", value: "Mohammadun Nabi" }
                                ]}
                                placeholder="Choose a Director"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2 pt-2 border-t border-gray-100 mt-2">
                            <label className="erp-label">Gateway Logo (Optional)</label>
                            <button className="h-10 erp-input bg-gray-50 border-dashed border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
                                <ImagePlus className="w-4 h-4 mr-2" /> Upload Logo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave} disabled={!formData.name.trim()}>
                    <Save className="w-4 h-4 mr-2" /> Save Payment Method
                </Button>
            </div>
        </div>
    );
}

export function PaymentMethodDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "payment_form";
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={manager.activeRecord?.id ? `Edit Method: ${manager.activeRecord.name}` : "Add Payment Gateway"}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <PaymentFormContent key={manager.activeRecord?.id || "new"} record={manager.activeRecord} manager={manager} />
        </Drawer>
    );
}