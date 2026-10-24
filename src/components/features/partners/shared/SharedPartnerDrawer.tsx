import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Image as ImageIcon } from "lucide-react";
import { PartnerType } from "@/store/usePartnerStore";
import { useSharedPartnerForm } from "@/hooks/partner_hooks/shared/useSharedPartnerForm";

export function SharedPartnerDrawer({
    partnerType,
    isEdit,
    isOpen,
    onClose,
    form
}: {
    partnerType: PartnerType;
    isEdit: boolean;
    isOpen: boolean;
    onClose: () => void;
    form: ReturnType<typeof useSharedPartnerForm>;
}) {
    if (!isOpen) return null;

    return (
        <Drawer title={`${isEdit ? "Update" : "Add"} ${partnerType}`} isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="flex flex-col h-full bg-gray-50/50">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Name <span className="text-red-500">*</span></label>
                                <input type="text" value={form.name} onChange={(e) => form.setName(e.target.value)} className="erp-input" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Email</label>
                                <input type="email" value={form.email} onChange={(e) => form.setEmail(e.target.value)} className="erp-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Primary Phone <span className="text-red-500">*</span></label>
                                <input type="text" value={form.primaryPhone} onChange={(e) => form.setPrimaryPhone(e.target.value)} className="erp-input" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Secondary Phone</label>
                                <input type="text" value={form.secondaryPhone} onChange={(e) => form.setSecondaryPhone(e.target.value)} className="erp-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Business Name <span className="text-red-500">*</span></label>
                                <input type="text" value={form.businessName} onChange={(e) => form.setBusinessName(e.target.value)} className="erp-input" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Trade License Number</label>
                                <input type="text" value={form.tradeLicense} onChange={(e) => form.setTradeLicense(e.target.value)} className="erp-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Business Logo</label>
                                <input type="file" ref={form.fileInputRef} onChange={form.handleFileChange} accept="image/*" className="hidden" />
                                <div onClick={form.triggerLogoUpload} className="erp-upload-zone">
                                    {form.logo ? (
                                        form.logo.startsWith("blob:") ? (
                                            <img src={form.logo} alt="Preview" className="h-12 w-12 rounded-md object-cover border border-gray-200" />
                                        ) : (
                                            <div className="h-12 w-12 bg-emerald-800 text-white flex items-center justify-center rounded-md font-bold text-sm">{form.logo}</div>
                                        )
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-[12px] text-gray-600">Recommended: 100x100 PX</span>
                                        <span className="text-[12px] text-gray-600">Max file size: 2MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Status <span className="text-red-500">*</span></label>
                                <CustomSelect value={form.status} onChange={form.setStatus} options={["Active", "Inactive"]} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-8">
                            <label className="erp-label">Street Address <span className="text-red-500">*</span></label>
                            <input type="text" value={form.address} onChange={(e) => form.setAddress(e.target.value)} className="erp-input" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 bg-white p-4 sm:px-8 flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 h-9 font-medium">Cancel</Button>
                    <Button type="button" variant="success" onClick={form.handleSave} className="px-8 h-9 font-medium">Save</Button>
                </div>
            </div>
        </Drawer>
    );
}