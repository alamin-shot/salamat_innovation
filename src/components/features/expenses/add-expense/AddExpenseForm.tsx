import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { UploadCloud } from "lucide-react";

export function AddExpenseForm({ manager }: { manager: any }) {
    const categoryOptions = [
        "Entertainment / Client Treats",
        "Employee Conveyance (TA, DA)",
        "Salaries & Wages",
        "Small Tools or Accessories",
        "Office Maintenance"
    ];

    const paymentOptions = ["Cash", "Bkash", "Nagad", "Bank Transfer"];

    return (
        <div className="flex flex-col gap-6">
            {/* Row 1: Title and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Title"
                        value={manager.title}
                        onChange={(e) => manager.setTitle(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={manager.date}
                        onChange={(e) => manager.setDate(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
            </div>

            {/* Row 2: Amount and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={manager.amount}
                        onChange={(e) => manager.setAmount(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        value={manager.category}
                        onChange={manager.setCategory}
                        options={categoryOptions}
                        placeholder="Choose a category"
                    />
                </div>
            </div>

            {/* Row 3: Payment Method and Attachments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        value={manager.paymentMethod}
                        onChange={manager.setPaymentMethod}
                        options={paymentOptions}
                        placeholder="Choose a payment method"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-gray-600">Attachments</label>
                    <div className="border border-dashed border-emerald-400 bg-emerald-50/30 rounded-lg p-3 flex flex-row items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-colors">
                        <UploadCloud className="h-6 w-6 text-emerald-600 ml-2" />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-gray-800">
                                Drop files here or click to upload
                            </span>
                            <span className="text-[12px] text-emerald-600">Upload Files</span>
                        </div>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                        Multiple support images jpeg,png,jpg,gif,svg,pdf,zip,doc,docx,xls,xlsx
                    </span>
                </div>
            </div>

            {/* Row 4: Note */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Note</label>
                <textarea
                    rows={4}
                    placeholder="Note"
                    value={manager.note}
                    onChange={(e) => manager.setNote(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white p-3 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none"
                />
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4">
                <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">
                    Submit
                </Button>
            </div>
        </div>
    );
}