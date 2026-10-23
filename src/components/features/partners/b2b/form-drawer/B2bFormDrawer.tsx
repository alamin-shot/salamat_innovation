import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Image as ImageIcon } from "lucide-react";
import { useB2bFormManager } from "@/hooks/partner_hooks/b2b_hooks/useB2bFormManager";
import { B2bPartner } from "@/hooks/partner_hooks/b2b_hooks/useB2bStore";

export function B2bFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: B2bPartner | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useB2bFormManager(initialRecord, onClose);
    const isEdit = Boolean(initialRecord);

    if (!isOpen) return null;

    return (
        <Drawer title={isEdit ? "Update B2B Partner" : "Add B2B Partner"} isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Name <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.name} onChange={(e) => manager.setName(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Email</label>
                            <input type="email" value={manager.email} onChange={(e) => manager.setEmail(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Primary Phone <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.primaryPhone} onChange={(e) => manager.setPrimaryPhone(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Secondary Phone</label>
                            <input type="text" value={manager.secondaryPhone} onChange={(e) => manager.setSecondaryPhone(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Business Name <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.businessName} onChange={(e) => manager.setBusinessName(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Trade License Number</label>
                            <input type="text" value={manager.tradeLicense} onChange={(e) => manager.setTradeLicense(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Business Logo</label>
                            <div onClick={manager.handleLogoUpload} className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                {manager.logo ? (
                                    <div className="h-12 w-12 bg-emerald-800 text-white flex items-center justify-center rounded-md font-bold text-sm shadow-sm">{manager.logo}</div>
                                ) : (
                                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[12px] text-gray-600">Recommended size: 100 x 100 PX</span>
                                    <span className="text-[12px] text-gray-600">Max file size: 2MB</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Status <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={manager.status}
                                onChange={manager.setStatus}
                                options={["Active", "Inactive"]}
                                placeholder="Select Status"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">Street Address <span className="text-red-500">*</span></label>
                        <input type="text" value={manager.address} onChange={(e) => manager.setAddress(e.target.value)} placeholder="Enter Your Street Address" className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="px-6 h-9 font-medium text-gray-600">Cancel</Button>
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">Save</Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}