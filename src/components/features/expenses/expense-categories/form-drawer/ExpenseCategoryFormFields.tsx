import { UploadCloud } from "lucide-react";

export function ExpenseCategoryFormFields({ manager }: { manager: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={manager.name}
                    onChange={(e) => manager.setName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-10"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Logo (Optional)</label>
                <div
                    onClick={manager.handleLogoUpload}
                    className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors w-32"
                >
                    {manager.logoPreview ? (
                        <div className="text-4xl">{manager.logoPreview}</div>
                    ) : (
                        <UploadCloud className="h-6 w-6 text-gray-400" />
                    )}
                </div>
            </div>
        </div>
    );
}