"use client";
import { useState } from "react";
import { useUserManager } from "@/hooks/user_hooks/useUserManager";
import { UserRecord } from "@/store/useGlobalUserStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Save, UserPlus } from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect"; // Ensure this matches your generic path

function UserFormContent({ record, manager }: { record: UserRecord | null, manager: ReturnType<typeof useUserManager> }) {
    const [formData, setFormData] = useState({
        name: record?.name || "",
        email: record?.email || "",
        phone: record?.phone || "",
        shop: record?.shop || "",
        role: record?.role || "",
        status: record?.status || "Active"
    });

    const handleSave = () => {
        if (record?.id) manager.store.updateUser(record.id, formData);
        else manager.store.addUser(formData as any);
        manager.setDrawerMode("none");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                <div className="erp-card bg-white p-5 border border-gray-200 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Full Name <span className="text-rose-500">*</span></label>
                        <input type="text" className="erp-input" placeholder="e.g. Alamin Rifat" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Email Address <span className="text-rose-500">*</span></label>
                        <input type="email" className="erp-input" placeholder="alamin@tekzo.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Phone Number <span className="text-rose-500">*</span></label>
                        <input type="text" className="erp-input" placeholder="017..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Assigned Role <span className="text-rose-500">*</span></label>
                            <CustomSelect
                                value={formData.role}
                                onChange={(val) => setFormData({ ...formData, role: val })}
                                options={manager.store.roles.map(r => ({ label: r.name, value: r.name }))}
                                placeholder="Choose a Role"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Shop Name <span className="text-rose-500">*</span></label>
                            <CustomSelect
                                value={formData.shop}
                                onChange={(val) => setFormData({ ...formData, shop: val })}
                                options={[
                                    { label: "All Shops (HQ)", value: "All" },
                                    { label: "Jamuna Future Park", value: "Jamuna Future Park" }
                                ]}
                                placeholder="Choose a Shop"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="border-gray-200 text-gray-600 shadow-2xs" onClick={() => manager.setDrawerMode("none")}>Cancel</Button>
                <Button variant="default" className="bg-brand-primary text-white shadow-md hover:shadow-lg" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save User
                </Button>
            </div>
        </div>
    );
}

export function UserFormDrawer({ manager }: { manager: ReturnType<typeof useUserManager> }) {
    const isOpen = manager.drawerMode === "user_form";
    const record = manager.activeRecord as UserRecord | null;
    return (
        <Drawer
            isOpen={isOpen}
            onClose={() => { manager.setDrawerMode("none"); setTimeout(() => manager.setActiveRecord(null), 300); }}
            title={record?.id ? `Edit User: ${record.name}` : "Add New User"}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {/* The Key prop strictly resets the state when a new record is opened */}
            <UserFormContent key={record?.id || "new"} record={record} manager={manager} />
        </Drawer>
    );
}