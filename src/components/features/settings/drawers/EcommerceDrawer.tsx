"use client";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Save } from "lucide-react";

function EcommerceFormContent({ record, manager }: { record: any; manager: any }) {
    const [formData, setFormData] = useState({
        name: record?.name || "",
        status: record?.status || "Active"
    });

    const handleSave = () => {
        if (record?.id) manager.store.updateEcommerce(record.id, formData);
        else manager.store.addEcommerce(formData);
        manager.setDrawerMode("none");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar pb-32 flex flex-col gap-6">
                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4 rounded-xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Platform Name <span className="text-rose-500">*</span></label>
                        <input type="text" className="erp-input font-bold text-gray-900" placeholder="e.g. TEKZO, Daraz" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Status</label>
                        <CustomSelect
                            value={formData.status}
                            onChange={val => setFormData({ ...formData, status: val as string })}
                            options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
                            placeholder="Set Status"
                        />
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                <Button variant="default" className="bg-brand-primary text-white" onClick={handleSave} disabled={!formData.name.trim()}>
                    <Save className="w-4 h-4 mr-2" /> Save Platform
                </Button>
            </div>
        </div>
    );
}

export function EcommerceDrawer({ manager }: { manager: any }) {
    const isOpen = manager.drawerMode === "ecommerce_form";
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={manager.activeRecord?.id ? `Edit Platform: ${manager.activeRecord.name}` : "Add E-commerce Platform"}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <EcommerceFormContent key={manager.activeRecord?.id || "new"} record={manager.activeRecord} manager={manager} />
        </Drawer>
    );
}