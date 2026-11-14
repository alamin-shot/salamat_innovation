import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCreateCashTransferForm } from "@/hooks/operations_hooks/useCreateCashTransferForm";
import { ShopSelectField } from "../../shared/ShopSelectField";
import { formatTaka } from "./formatTaka";

interface CreateCashTransferFormProps {
    onCancel: () => void;
    onCreated: () => void;
}

export function CreateCashTransferForm({ onCancel, onCreated }: CreateCashTransferFormProps) {
    const form = useCreateCashTransferForm(onCreated);
    const shownAmount = Number.isFinite(form.amount) && form.amount > 0 ? formatTaka(form.amount) : formatTaka(0);

    return (
        <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                <ShopSelectField label="From Shop" value={form.fromShop} onChange={form.setFromShop} />
                <ShopSelectField label="To Shop" value={form.toShop} onChange={form.setToShop} />
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">Amount <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amountText}
                        onChange={(e) => form.setAmountText(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">Transfer Date <span className="text-red-500">*</span></label>
                    <DatePicker value={form.date} onChange={form.setDate} />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">Note</label>
                    <textarea value={form.note} onChange={(e) => form.setNote(e.target.value)} rows={2} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 resize-none" />
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg border border-sky-200 bg-sky-50/50 text-sky-800 text-[12px]">
                    <Info className="h-4 w-4 shrink-0 text-sky-500" />
                    <span>A cash transfer of <b>{shownAmount}</b> will be recorded from the source shop to the destination shop. Status will be <b>Draft</b> until approved.</span>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={onCancel} className="px-6 text-gray-600 hover:bg-gray-50">Cancel</Button>
                <Button variant="success" onClick={form.submit} className="px-6">Create Transfer</Button>
            </div>
        </div>
    );
}
