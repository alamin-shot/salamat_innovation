import Image from "next/image";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DirectorFormManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorFormManager";

const INPUT = "h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none";

export function DirectorProfileFormFields({ manager }: { manager: DirectorFormManager }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.fullName} onChange={(e) => manager.setFullName(e.target.value)} className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.title} onChange={(e) => manager.setTitle(e.target.value)} className={INPUT} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={manager.email} onChange={(e) => manager.setEmail(e.target.value)} className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Phone <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.phone} onChange={(e) => manager.setPhone(e.target.value)} className={INPUT} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Password {!manager.isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <input
                            type={manager.showPassword ? "text" : "password"}
                            value={manager.password}
                            onChange={(e) => manager.setPassword(e.target.value)}
                            placeholder={manager.isEdit ? "Leave blank to keep the current password" : ""}
                            autoComplete="new-password"
                            className={`${INPUT} pr-10`}
                        />
                        <Button type="button" variant="ghost" size="icon-sm" onClick={manager.togglePasswordVisibility} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {manager.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Profile photo</label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/30 p-3 transition-colors hover:bg-emerald-50">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { manager.handlePhotoUpload(e.target.files?.[0]); e.target.value = ""; }} />
                        {manager.avatarUrl ? (
                            <Image src={manager.avatarUrl} alt="Profile photo" width={40} height={40} unoptimized className="h-10 w-10 rounded-md object-cover" />
                        ) : (
                            <UploadCloud className="ml-2 h-6 w-6 text-emerald-600" />
                        )}
                        <span className="text-[13px] font-medium text-gray-800">{manager.avatarUrl ? "Change photo" : "Profile photo (max 2MB)"}</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
                <Button type="button" variant="success" onClick={manager.handleSave} className="h-9 px-8 font-medium">{manager.isEdit ? "Save Changes" : "Submit"}</Button>
            </div>
        </div>
    );
}
