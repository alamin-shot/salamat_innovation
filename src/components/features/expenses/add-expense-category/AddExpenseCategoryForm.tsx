import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AddExpenseCategoryForm({ manager }: { manager: any }) {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={manager.name}
                        onChange={(e) => manager.setName(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-10"
                    />
                </div>

                {/* Logo Upload Area */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Logo (Optional)</label>
                    <div
                        onClick={manager.handleLogoUpload}
                        className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors w-32"
                    >
                        {manager.logoPreview ? (
                            <div className="text-4xl">{manager.logoPreview}</div>
                        ) : (
                            <UploadCloud className="h-6 w-6 text-gray-300" strokeWidth={1.5} />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="success"
                    onClick={manager.handleSave}
                    className="px-8 h-9 font-medium"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}