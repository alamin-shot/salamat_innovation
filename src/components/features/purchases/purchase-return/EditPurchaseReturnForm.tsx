import * as React from "react";
import { Image as ImageIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { useEditPurchaseReturnManager } from "@/hooks/purchases_hooks/useEditPurchaseReturnManager";
import { PurchaseReturn } from "@/types/purchases";
import { PURCHASE_FORM_ERRORS } from "@/constants/purchases";
import { formatPurchaseTaka } from "@/utils/purchaseMath";
import { PurchaseUnitSearchBar } from "../shared/PurchaseUnitSearchBar";
import { PurchaseLineItemsTable } from "../shared/PurchaseLineItemsTable";
import { PurchaseCostingSummary } from "../shared/PurchaseCostingSummary";

interface EditPurchaseReturnFormProps {
    record: PurchaseReturn;
    onCancel: () => void;
    onSaved: () => void;
}

export function EditPurchaseReturnForm({ record, onCancel, onSaved }: EditPurchaseReturnFormProps) {
    const manager = useEditPurchaseReturnManager(record);
    const { isLocked } = manager;

    const handleSave = () => {
        const result = manager.save();
        if (!result.ok) {
            toast.error(PURCHASE_FORM_ERRORS[result.error]);
            return;
        }
        toast.success(`Purchase return ${record.invoiceNumber} updated successfully!`);
        onSaved();
    };

    return (
        <div className="flex flex-col gap-8 bg-white pb-32">
            {isLocked && (
                // Reached by URL on a settled return: show it read-only.
                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700" role="status">
                    <Lock className="h-5 w-5 shrink-0" />
                    <p><span className="font-bold">Settled return.</span> It has no due left, so it can no longer be edited.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Supplier</label>
                        <p className="text-[14px] font-medium text-gray-800 mt-1">{record.supplier}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-[13px] text-gray-500">Invoice/Bill</label>
                        <div className="flex items-center gap-4 rounded border border-dashed border-gray-300 bg-gray-50/50 p-4 w-max pr-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-white border border-gray-200 text-gray-400 shadow-sm">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col text-[12px] text-gray-500">
                                <span>Recommended size: 300 X 90 PX</span>
                                <span>Max file size: 2MB</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                        <DatePicker value={manager.date} onChange={manager.setDate} />
                    </div>
                    <div className="flex flex-col gap-1 rounded border border-amber-100 bg-amber-50/60 px-4 py-3 text-[13px]">
                        <span className="flex justify-between text-gray-600"><span>Due Amount</span><span>{formatPurchaseTaka(record.dueAmount)}</span></span>
                        {!isLocked && manager.nextDue !== record.dueAmount && (
                            <span className="flex justify-between font-semibold text-amber-700"><span>Due after saving</span><span>{formatPurchaseTaka(manager.nextDue)}</span></span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[13px] text-gray-500">Product</label>
                {!isLocked && (
                    <PurchaseUnitSearchBar
                        query={manager.search.query}
                        onQueryChange={manager.search.setQuery}
                        results={manager.search.results}
                        onScan={manager.search.scan}
                        onPick={manager.search.pick}
                        placeholder={`Scan or search units bought from ${record.supplier}`}
                        emptyText={`No in-stock unit from ${record.supplier} matches. Press Enter to check a serial.`}
                    />
                )}
                <PurchaseLineItemsTable
                    items={manager.items}
                    onUnitPriceChange={isLocked ? undefined : manager.setUnitPrice}
                    onRemove={isLocked ? undefined : manager.removeItem}
                    quantityLabel="Return Qty"
                    totalLabel="Total Refund"
                    emptyText="No products in this return"
                />
            </div>

            <PurchaseCostingSummary
                costing={manager.costing}
                totals={manager.totals}
                onChange={manager.updateCosting}
                discountLabel="Deduction"
                totalLabel="Total Refund"
                disabled={isLocked}
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="px-5">{isLocked ? "Close" : "Cancel"}</Button>
                {!isLocked && (
                    <Button type="button" variant="success" onClick={handleSave} className="px-8">Save</Button>
                )}
            </div>
        </div>
    );
}
