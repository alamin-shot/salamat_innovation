import { CustomSelect } from "@/components/ui/CustomSelect";

export function ExpenseFormFields({ manager }: { manager: any }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Shop Name <span className="text-red-500">*</span></label>
                    <CustomSelect value={manager.shopName} onChange={manager.setShopName} options={["TEKZO A-Block", "TEKZO B-Block"]} placeholder="Select Shop" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={manager.title} onChange={(e) => manager.setTitle(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Amount <span className="text-red-500">*</span></label>
                    <input type="number" value={manager.amount} onChange={(e) => manager.setAmount(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Category <span className="text-red-500">*</span></label>
                <CustomSelect value={manager.category} onChange={manager.setCategory} options={["Entertainment / Client Treats", "Employee Conveyance (TA, DA)", "Salaries & Wages", "Small Tools or Accessories"]} placeholder="Select Category" />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Attachments</label>
                <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50 transition-colors">
                    <span className="text-sm font-medium text-emerald-800">Drop files here or click to upload</span>
                    <span className="text-xs text-emerald-600 mt-1">Multiple support images, pdf, doc, xlsx</span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Note</label>
                <textarea rows={3} value={manager.note} onChange={(e) => manager.setNote(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white p-2.5 text-[13px] focus:border-emerald-500 focus:outline-none resize-none" />
            </div>
        </div>
    );
}