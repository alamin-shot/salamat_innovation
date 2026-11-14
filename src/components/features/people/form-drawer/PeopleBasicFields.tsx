import Image from "next/image";
import { ImagePlus, Lock } from "lucide-react";
import { PeopleFormManager } from "@/hooks/people_hooks/usePeopleFormManager";

export function PeopleBasicFields({ manager }: { manager: PeopleFormManager }) {
    return (
        <div className="flex flex-col gap-2">
            {/* Type comes from the button that opened the form (or the existing profile) and is never edited. */}
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-2.5 rounded-lg border border-emerald-500 bg-emerald-50/40 px-4 py-2.5 text-xs font-medium text-emerald-800">
                    <Lock className="h-3.5 w-3.5" />
                    <span>{manager.type}</span>
                </span>
            </div>

            {/* Row 1: Name, Business Name, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={manager.name}
                        onChange={(e) => manager.setName(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Business Name {manager.isBusinessRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        placeholder="Business Name"
                        value={manager.businessName}
                        onChange={(e) => manager.setBusinessName(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Phone"
                        value={manager.phone}
                        onChange={(e) => manager.setPhone(e.target.value)}
                        readOnly={manager.isEdit}
                        title={manager.isEdit ? "The phone number identifies this profile and cannot be changed." : undefined}
                        className={`w-full rounded-md border border-gray-200 px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none ${manager.isEdit ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                    />
                </div>
            </div>

            {/* Row 2: Secondary Phone, Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Secondary Phone</label>
                    <input
                        type="text"
                        placeholder="Secondary Phone"
                        value={manager.secondaryPhone}
                        onChange={(e) => manager.setSecondaryPhone(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={manager.email}
                        onChange={(e) => manager.setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Row 3: Profile Picture & Business Logo Uploaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3 gap-2">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-gray-600">Profile Picture</label>
                    <div className="flex items-center gap-4">
                        <label className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-emerald-400 transition-colors">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { manager.handleImageUpload("avatar", e.target.files?.[0]); e.target.value = ""; }} />
                            {manager.profilePicture
                                ? <Image src={manager.profilePicture} alt="Profile picture" fill unoptimized className="object-cover" />
                                : <ImagePlus className="h-7 w-7 text-gray-300" />}
                        </label>
                        <div className="flex flex-col text-[11px] text-gray-500">
                            <span>Recommended size 800×600</span>
                            <span>Max file size: 2MB</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-gray-600">Business Logo</label>
                    <div className="flex items-center gap-4">
                        <label className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-emerald-400 transition-colors">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { manager.handleImageUpload("logo", e.target.files?.[0]); e.target.value = ""; }} />
                            {manager.businessLogo
                                ? <Image src={manager.businessLogo} alt="Business logo" fill unoptimized className="object-cover" />
                                : <ImagePlus className="h-7 w-7 text-gray-300" />}
                        </label>
                        <div className="flex flex-col text-[11px] text-gray-500">
                            <span>Recommended size 800×600</span>
                            <span>Max file size: 2MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}