"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Save, ImagePlus } from "lucide-react";
import { ShopRecord } from "@/types/settings";

// We utilize global TS type inference, no ReturnType import needed
function ShopFormContent({ record, manager }: { record: ShopRecord | null; manager: any }) {
    const [formData, setFormData] = useState({
        name: record?.name || "",
        phone: record?.phone || "",
        email: record?.email || "",
        status: record?.status || "Active"
    });

    const handleSave = () => {
        if (record?.id) manager.store.updateShop(record.id, formData);
        else manager.store.addShop(formData);
        manager.setDrawerMode("none");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* LEAK 4 SEALED: pb-32 added to prevent dropdown clipping */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-6">

                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="erp-label">Shop Name <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input font-bold text-gray-900" placeholder="e.g. TEKZO Online Shop" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Primary Phone Number <span className="text-rose-500">*</span></label>
                            <input type="text" className="erp-input" placeholder="+880..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Email Address</label>
                            <input type="email" className="erp-input" placeholder="hello@..." value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 mt-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Operational Status</label>
                            <CustomSelect
                                value={formData.status}
                                onChange={val => setFormData({ ...formData, status: val as any })}
                                options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
                                placeholder="Set Status"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Shop Logo (Optional)</label>
                            <button className="h-9 erp-input bg-gray-50 border-dashed border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
                                <ImagePlus className="w-4 h-4 mr-2" /> Upload Logo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave} disabled={!formData.name.trim()}>
                    <Save className="w-4 h-4 mr-2" /> Save Shop
                </Button>
            </div>
        </div>
    );
}

export function ShopFormDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "shop_form";
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={manager.activeRecord?.id ? `Edit Shop: ${manager.activeRecord.name}` : "Architect New Shop"}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <ShopFormContent key={manager.activeRecord?.id || "new"} record={manager.activeRecord} manager={manager} />
        </Drawer>
    );
}