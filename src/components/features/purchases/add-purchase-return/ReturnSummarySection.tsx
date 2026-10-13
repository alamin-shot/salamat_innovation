"use client";
import * as React from "react";
import { useAddPurchaseReturnManager } from "@/hooks/useAddPurchaseReturnManager";
import { CustomSelect } from "../../../ui/CustomSelect";

type Manager = ReturnType<typeof useAddPurchaseReturnManager>;

export function ReturnSummarySection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Deduction Type</label>
                    <CustomSelect value={manager.discountType} onChange={manager.setDiscountType} options={["Fixed", "Percentage"]} placeholder="Choose Type" />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Deduction Amount</label>
                    <input type="number" value={manager.discountAmount || ""} onChange={(e) => manager.setDiscountAmount(parseFloat(e.target.value) || 0)} placeholder="Amount" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Order Tax</label>
                    <input type="number" value={manager.orderTaxPct || ""} onChange={(e) => manager.setOrderTaxPct(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                    <label className="text-[13px] text-gray-500 mb-2 block">Shipping</label>
                    <input type="number" value={manager.shippingCost || ""} onChange={(e) => manager.setShippingCost(parseFloat(e.target.value) || 0)} placeholder="Shipping Cost" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
            </div>

            {/* Live Ledger Table */}
            <div className="flex flex-col border border-gray-100 rounded bg-white">
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Sub Total</span>
                    <span>৳ {manager.totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Deduction (-)</span>
                    <span>{manager.totals.discount}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Order Tax</span>
                    <span>{manager.totals.tax} (%)</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                    <span>Shipping</span>
                    <span>৳ {manager.totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-blue-500 p-3.5">
                    <span>Total Refund (=)</span>
                    <span>৳ {manager.totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
}