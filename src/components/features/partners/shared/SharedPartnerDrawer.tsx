import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Partner, PartnerType } from "@/types/partners";
import { PARTNER_TYPE_LABELS } from "@/constants/partners";
import { useSharedPartnerForm } from "@/hooks/partner_hooks/shared/useSharedPartnerForm";

function PartnerFormBody({ partnerType, record, onClose }: { partnerType: PartnerType; record: Partner | null; onClose: () => void }) {
    const form = useSharedPartnerForm(partnerType, record, onClose);

    return (
        <div className="flex min-h-full flex-col bg-gray-50/50">
            <div className="flex-1 p-4 pb-32">
                <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-lg border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Name <span className="text-red-500">*</span></label>
                            <input type="text" value={form.name} onChange={(e) => form.setName(e.target.value)} className="erp-input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Email</label>
                            <input type="email" value={form.email} onChange={(e) => form.setEmail(e.target.value)} className="erp-input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Primary Phone <span className="text-red-500">*</span></label>
                            <input type="text" value={form.primaryPhone} onChange={(e) => form.setPrimaryPhone(e.target.value)} className="erp-input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Secondary Phone</label>
                            <input type="text" value={form.secondaryPhone} onChange={(e) => form.setSecondaryPhone(e.target.value)} className="erp-input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Business Name <span className="text-red-500">*</span></label>
                            <input type="text" value={form.businessName} onChange={(e) => form.setBusinessName(e.target.value)} className="erp-input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Trade License Number</label>
                            <input type="text" value={form.tradeLicense} onChange={(e) => form.setTradeLicense(e.target.value)} className="erp-input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Business Logo</label>
                            <label className="erp-upload-zone cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { form.handleLogo(e.target.files?.[0]); e.target.value = ""; }} />
                                {form.logoUrl ? (
                                    <span className="relative block h-12 w-12 overflow-hidden rounded-md border border-gray-200">
                                        <Image src={form.logoUrl} alt="Logo preview" fill unoptimized className="object-cover" />
                                    </span>
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[12px] text-gray-600">Recommended: 100x100 PX</span>
                                    <span className="text-[12px] text-gray-600">Max file size: 2MB</span>
                                </div>
                            </label>
                            {form.logoUrl && (
                                <button type="button" onClick={form.clearLogo} className="inline-flex w-fit items-center gap-1 text-xs font-medium text-rose-600 hover:underline"><X className="h-3 w-3" /> Remove logo</button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Tier <span className="text-red-500">*</span></label>
                                <CustomSelect value={form.tier} onChange={form.setTier} options={form.tierOptions} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Status <span className="text-red-500">*</span></label>
                                <CustomSelect value={form.status} onChange={form.setStatus} options={form.statusOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 flex flex-col gap-1.5">
                        <label className="erp-label">Street Address</label>
                        <input type="text" value={form.address} onChange={(e) => form.setAddress(e.target.value)} className="erp-input" />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] sm:px-8">
                <Button type="button" variant="outline" onClick={onClose} className="h-9 px-6 font-medium">Cancel</Button>
                <Button type="button" variant="success" onClick={form.handleSave} className="h-9 px-8 font-medium">Save</Button>
            </div>
        </div>
    );
}

export function SharedPartnerDrawer({ partnerType, record, isOpen, onClose }: { partnerType: PartnerType; record: Partner | null; isOpen: boolean; onClose: () => void }) {
    const label = PARTNER_TYPE_LABELS[partnerType].one;
    return (
        <Drawer title={`${record ? "Update" : "Add"} ${label}`} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {isOpen && <PartnerFormBody key={record?.id ?? "new"} partnerType={partnerType} record={record} onClose={onClose} />}
        </Drawer>
    );
}
