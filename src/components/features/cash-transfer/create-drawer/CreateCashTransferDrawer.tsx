import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useCashTransferManager } from "@/hooks/useCashTransferManager";
import { Info } from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function CreateCashTransferDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const manager = useCashTransferManager();
    const shopOptions = ["TEKZO JFP 4A-018A", "Salamat Innovation", "TEKZO Online Shop", "A-Block"];

    if (!isOpen) return null;

    return (
        <Drawer title="Create Cash Transfer" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">

                    {/* Top Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500 font-medium">From Shop <span className="text-red-500">*</span></label>
                            <CustomSelect value={manager.fromShop} onChange={manager.setFromShop} options={shopOptions} placeholder="Select From Shop" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500 font-medium">To Shop <span className="text-red-500">*</span></label>
                            <CustomSelect value={manager.toShop} onChange={manager.setToShop} options={shopOptions} placeholder="Select To Shop" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500 font-medium">Amount <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={manager.amount}
                                onChange={(e) => manager.setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500 font-medium">Transfer Date <span className="text-red-500">*</span></label>
                            <input type="date" value={manager.transferDate} onChange={(e) => manager.setTransferDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    {/* Note & Draft Notice */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500 font-medium">Note</label>
                            <textarea value={manager.note} onChange={(e) => manager.setNote(e.target.value)} rows={2} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 resize-none" />
                        </div>

                        {/* Notice Banner matching screenshot */}
                        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-sky-200 bg-sky-50/50 text-sky-800 text-[12px]">
                            <Info className="h-4 w-4 shrink-0 text-sky-500" />
                            <span>Cash transfer of <b>{manager.amount || 0}</b> will be recorded from the selected source shop to the destination shop. Status will be <b>Draft</b> until approved.</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button variant="outline" onClick={onClose} className="px-6 text-gray-600 hover:bg-gray-50">Cancel</Button>
                        <Button variant="success" onClick={manager.handleCreate} className="px-6">Create Transfer</Button>
                    </div>

                </div>
            </div>
        </Drawer>
    );
}