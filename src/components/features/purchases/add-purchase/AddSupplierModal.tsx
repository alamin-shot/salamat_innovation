import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { usePeopleFormManager } from "@/hooks/people_hooks/usePeopleFormManager";
import { PEOPLE_AREAS, PEOPLE_COUNTRIES, PEOPLE_DISTRICTS } from "@/constants/people";
import { PersonRecord } from "@/types/people";

const CREATE_SUPPLIER = { kind: "create", origin: "purchase_add_supplier" } as const;

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Receives the new People supplier so the purchase form can select it. */
    onCreated: (person: PersonRecord) => void;
}

/** Add Purchase → "Add Supplier": creates a People profile of type Supplier. Unmounted while closed, so it always opens empty. */
export function AddSupplierModal({ isOpen, onClose, onCreated }: AddSupplierModalProps) {
    if (!isOpen) return null;
    return <AddSupplierModalBody onClose={onClose} onCreated={onCreated} />;
}

function AddSupplierModalBody({ onClose, onCreated }: Omit<AddSupplierModalProps, "isOpen">) {
    const form = usePeopleFormManager(CREATE_SUPPLIER, onCreated);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

            <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-brand-subtext/20 px-6 py-4">
                    <h2 className="text-lg font-bold text-brand-text">Add Supplier</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); form.handleSave(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Supplier Name *</label>
                                <input type="text" placeholder="Name" value={form.name} onChange={(e) => form.setName(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Business Name *</label>
                                <input type="text" placeholder="Business Name" value={form.businessName} onChange={(e) => form.setBusinessName(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Phone *</label>
                                <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => form.setPhone(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Secondary Phone</label>
                                <input type="tel" placeholder="Secondary Phone" value={form.secondaryPhone} onChange={(e) => form.setSecondaryPhone(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Email</label>
                                <input type="email" placeholder="Email" value={form.email} onChange={(e) => form.setEmail(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Profile Picture</label>
                                <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-brand-subtext/30 bg-brand-bg/10 p-3 hover:border-emerald-400">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { form.handleImageUpload("avatar", e.target.files?.[0]); e.target.value = ""; }} />
                                    {form.profilePicture
                                        ? <Image src={form.profilePicture} alt="Profile Picture" width={32} height={32} unoptimized className="h-8 w-8 rounded object-cover" />
                                        : <ImageIcon className="h-8 w-8 text-brand-subtext" />}
                                    <div className="flex flex-col text-[11px] text-brand-subtext">
                                        <span>Recommended size 800x600</span>
                                        <span>Max file size: 2MB</span>
                                    </div>
                                </label>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Business Logo</label>
                                <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-brand-subtext/30 bg-brand-bg/10 p-3 hover:border-emerald-400">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { form.handleImageUpload("logo", e.target.files?.[0]); e.target.value = ""; }} />
                                    {form.businessLogo
                                        ? <Image src={form.businessLogo} alt="Business Logo" width={32} height={32} unoptimized className="h-8 w-8 rounded object-cover" />
                                        : <ImageIcon className="h-8 w-8 text-brand-subtext" />}
                                    <div className="flex flex-col text-[11px] text-brand-subtext">
                                        <span>Recommended size 800x600</span>
                                        <span>Max file size: 2MB</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-brand-text mb-4 border-b border-brand-subtext/20 pb-2">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <CustomSelect value={form.country} onChange={form.setCountry} options={PEOPLE_COUNTRIES} placeholder="Choose a Country" />
                                <CustomSelect value={form.district} onChange={form.setDistrict} options={PEOPLE_DISTRICTS} placeholder="Select District" />
                                <CustomSelect value={form.area} onChange={form.setArea} options={PEOPLE_AREAS} placeholder="Select Area" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Enter Thana" value={form.thana} onChange={(e) => form.setThana(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Enter Postal Code" value={form.postalCode} onChange={(e) => form.setPostalCode(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Enter Your Street Address" value={form.streetAddress} onChange={(e) => form.setStreetAddress(e.target.value)} className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-brand-subtext/20 px-6 py-4 bg-brand-bg/30 rounded-b-xl">
                    <button type="button" onClick={onClose} className="rounded-md border border-brand-subtext/30 bg-white px-6 py-2 text-sm font-bold text-brand-text hover:bg-brand-bg transition-colors">Cancel</button>
                    <button type="button" onClick={form.handleSave} className="rounded-md bg-emerald-600 px-8 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm">Save</button>
                </div>
            </div>
        </div>
    );
}