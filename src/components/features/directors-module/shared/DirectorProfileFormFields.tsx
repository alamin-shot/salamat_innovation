import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DirectorProfileFormFields({ manager }: { manager: any }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.fullName} onChange={(e) => manager.setFullName(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.title} onChange={(e) => manager.setTitle(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={manager.email} onChange={(e) => manager.setEmail(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Phone <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.phone} onChange={(e) => manager.setPhone(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input type={manager.showPassword ? "text" : "password"} value={manager.password} onChange={(e) => manager.setPassword(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-10 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        <Button type="button" variant="ghost" size="icon-sm" onClick={manager.togglePasswordVisibility} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {manager.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Profile photo</label>
                    <div onClick={manager.handlePhotoUpload} className="border border-dashed border-emerald-400 bg-emerald-50/30 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-colors">
                        {manager.avatar ? (
                            <div className="h-10 w-10 bg-emerald-700 text-white flex items-center justify-center rounded-md font-bold">{manager.avatar}</div>
                        ) : (
                            <UploadCloud className="h-6 w-6 text-emerald-600 ml-2" />
                        )}
                        <span className="text-[13px] font-medium text-gray-800">Profile photo size</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">Submit</Button>
            </div>
        </div>
    );
}