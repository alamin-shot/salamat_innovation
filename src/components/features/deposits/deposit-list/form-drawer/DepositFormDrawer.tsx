import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { UploadCloud } from "lucide-react";
import { useDepositFormManager } from "@/hooks/finance_hooks/deposit_hooks/useDepositFormManager";
import { useDirectorStore } from "@/hooks/finance_hooks/withdrawal_hooks/useDirectorStore";
import { Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";

export function DepositFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: Deposit | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useDepositFormManager(initialRecord, onClose);
    const { directors } = useDirectorStore();
    const directorNames = directors.map(d => d.name);

    if (!isOpen) return null;

    return (
        <Drawer title="Edit Deposit" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Title <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.title} onChange={(e) => manager.setTitle(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Date <span className="text-red-500">*</span></label>
                            <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Amount <span className="text-red-500">*</span></label>
                            <input type="number" value={manager.amount} onChange={(e) => manager.setAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Director <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={manager.categoryDirectorName}
                                onChange={manager.setCategoryDirectorName}
                                options={directorNames}
                                placeholder="Choose a Director"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Attachments</label>
                            <div className="border border-dashed border-emerald-400 bg-emerald-50/30 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-colors">
                                <UploadCloud className="h-6 w-6 text-emerald-600 ml-2" />
                                <div className="flex flex-col"><span className="text-[13px] font-medium text-gray-800">Drop files here or click to upload</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Note</label>
                            <textarea rows={3} value={manager.note} onChange={(e) => manager.setNote(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white p-3 text-[13px] focus:border-emerald-500 focus:outline-none resize-none" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">Submit</Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}