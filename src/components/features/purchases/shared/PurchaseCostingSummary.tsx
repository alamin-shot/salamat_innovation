import * as React from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PurchaseCosting, PurchaseDiscountType, PurchaseTotals } from "@/types/purchases";
import { parseAmountInput } from "@/utils/purchaseMath";

interface PurchaseCostingSummaryProps {
    costing: PurchaseCosting;
    totals: PurchaseTotals;
    onChange: (changes: Partial<PurchaseCosting>) => void;
    /** "Discount" on purchases, "Deduction" on returns. */
    discountLabel?: string;
    /** "Total" on purchases, "Total Refund" on returns. */
    totalLabel?: string;
    disabled?: boolean;
}

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-50";
const DISCOUNT_TYPES: PurchaseDiscountType[] = ["Fixed", "Percentage"];
const money = (amount: number) => `৳ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const toDiscountType = (value: string): PurchaseDiscountType | null => DISCOUNT_TYPES.find((type) => type === value) ?? null;

/** Costing inputs + live ledger: Subtotal - Discount + Tax (manual amount) + Shipping = Total. */
export function PurchaseCostingSummary({ costing, totals, onChange, discountLabel = "Discount", totalLabel = "Total", disabled = false }: PurchaseCostingSummaryProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">{discountLabel} Type</label>
                    <CustomSelect
                        value={costing.discountType ?? ""}
                        onChange={(value) => onChange({ discountType: toDiscountType(value) })}
                        options={DISCOUNT_TYPES}
                        placeholder={`Choose a ${discountLabel} Type`}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">{discountLabel} Amount</label>
                    <input type="number" min="0" disabled={disabled} value={costing.discountAmount || ""} onChange={(e) => onChange({ discountAmount: parseAmountInput(e.target.value) })} placeholder={costing.discountType === "Percentage" ? "%" : "Amount"} className={INPUT} />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Tax (fixed amount)</label>
                    <input type="number" min="0" disabled={disabled} value={costing.taxAmount || ""} onChange={(e) => onChange({ taxAmount: parseAmountInput(e.target.value) })} placeholder="0.00" className={INPUT} />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Shipping</label>
                    <input type="number" min="0" disabled={disabled} value={costing.shippingCost || ""} onChange={(e) => onChange({ shippingCost: parseAmountInput(e.target.value) })} placeholder="Shipping Cost" className={INPUT} />
                </div>
            </div>

            <div className="flex flex-col border border-gray-100 rounded bg-white h-max">
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Sub Total</span><span>{money(totals.subTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>{discountLabel} (-)</span><span>{money(totals.discount)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Tax (+)</span><span>{money(totals.tax)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Shipping (+)</span><span>{money(totals.shipping)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-semibold text-blue-500 p-3.5">
                    <span>{totalLabel} (=)</span><span>{money(totals.total)}</span>
                </div>
            </div>
        </div>
    );
}
