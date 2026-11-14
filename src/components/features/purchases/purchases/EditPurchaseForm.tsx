import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useEditPurchaseManager } from "@/hooks/purchases_hooks/useEditPurchaseManager";
import { Purchase } from "@/types/purchases";
import { PURCHASE_FORM_ERRORS } from "@/constants/purchases";
import { useSupplierOptions } from "@/hooks/people_hooks/useSupplierOptions";
import { PurchaseLocationField } from "../shared/PurchaseLocationField";
import { PurchaseStatusBadge } from "../shared/PurchaseStatusBadge";
import { PurchaseUnitSearchBar } from "../shared/PurchaseUnitSearchBar";
import { PurchaseLineItemsTable } from "../shared/PurchaseLineItemsTable";
import { PurchaseCostingSummary } from "../shared/PurchaseCostingSummary";

interface EditPurchaseFormProps {
    purchase: Purchase;
    onCancel: () => void;
    onSaved: () => void;
}

const LABEL = "text-[13px] text-gray-600";

/** Legacy Edit Purchase: Supplier / Date / Location, Product Search, one row per Serial/IMEI, costing. */
export function EditPurchaseForm({ purchase, onCancel, onSaved }: EditPurchaseFormProps) {
    const manager = useEditPurchaseManager(purchase);

    const supplierOptions = useSupplierOptions(manager.supplier);

    const handleSave = () => {
        const result = manager.save();
        if (!result.ok) {
            toast.error(PURCHASE_FORM_ERRORS[result.error]);
            return;
        }
        toast.success(`Purchase ${purchase.invoiceNumber} updated successfully!`);
        onSaved();
    };

    return (
        <div className="flex flex-col gap-8 pb-32">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3">
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Invoice</span>
                    <span className="font-mono text-sm font-semibold text-gray-800">{purchase.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">Status</span>
                    <PurchaseStatusBadge status={purchase.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL}>Supplier <span className="text-red-500">*</span></label>
                    <CustomSelect value={manager.supplier} onChange={manager.setSupplier} options={supplierOptions} placeholder="Choose a Supplier" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL}>Date <span className="text-red-500">*</span></label>
                    <DatePicker value={manager.date} onChange={manager.setDate} />
                </div>
                <PurchaseLocationField value={manager.location} onChange={manager.setLocation} />
            </div>

            <div className="flex flex-col gap-3">
                <label className={LABEL}>Product</label>
                <PurchaseUnitSearchBar
                    query={manager.search.query}
                    onQueryChange={manager.search.setQuery}
                    results={manager.search.results}
                    onScan={manager.search.scan}
                    onPick={manager.search.pick}
                    placeholder="Scan or type a Serial/IMEI, product name or SKU"
                    emptyText="No un-received barcode (Generated / Printed) matches. Press Enter to check a serial."
                />
                <PurchaseLineItemsTable items={manager.items} onUnitPriceChange={manager.setUnitPrice} onRemove={manager.removeItem} />
            </div>

            <PurchaseCostingSummary costing={manager.costing} totals={manager.totals} onChange={manager.updateCosting} />

            <div className="flex items-center justify-end gap-3 border-t border-brand-subtext/10 pt-6">
                <Button type="button" variant="outline" onClick={onCancel} className="px-5">Cancel</Button>
                <Button type="button" variant="success" onClick={handleSave} className="gap-2 px-6">
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>
        </div>
    );
}
