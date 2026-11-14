import * as React from "react";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCreateStockTransferForm } from "@/hooks/operations_hooks/useCreateStockTransferForm";
import { ShopSelectField } from "../../shared/ShopSelectField";
import { SerialScanInput } from "../../shared/SerialScanInput";
import { OperationSerialsTable } from "../../shared/OperationSerialsTable";

interface CreateStockTransferFormProps {
    onCancel: () => void;
    onCreated: () => void;
}

export function CreateStockTransferForm({ onCancel, onCreated }: CreateStockTransferFormProps) {
    const form = useCreateStockTransferForm(onCreated);

    return (
        <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                <ShopSelectField label="From Shop" value={form.fromShop} onChange={form.setFromShop} />
                <ShopSelectField label="To Shop" value={form.toShop} onChange={form.setToShop} />
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">Transfer Date <span className="text-red-500">*</span></label>
                    <DatePicker value={form.date} onChange={form.setDate} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">Note</label>
                    <textarea value={form.note} onChange={(e) => form.setNote(e.target.value)} rows={1} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 resize-none min-h-[38px]" />
                </div>
            </div>

            <hr className="border-gray-100" />

            <SerialScanInput value={form.scanner.query} onChange={form.scanner.setQuery} onScan={form.scanner.scan} />
            <OperationSerialsTable title="Transfer Serials" serials={form.scanner.serials} onRemove={form.scanner.remove} />

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={onCancel} className="px-6 text-gray-600 hover:bg-gray-50">Cancel</Button>
                <Button variant="success" onClick={form.submit} className="px-6">Create Transfer</Button>
            </div>
        </div>
    );
}
