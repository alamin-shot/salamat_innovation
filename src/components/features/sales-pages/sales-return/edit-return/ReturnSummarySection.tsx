"use client";
import * as React from "react";
import { useSaleReturnManager } from "@/hooks/sales_hooks/useSaleReturnManager";

type Manager = ReturnType<typeof useSaleReturnManager>;

export function ReturnSummarySection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Order Tax</label>
                    <input type="number" value={manager.orderTaxPct || ""} onChange={(e) => manager.setOrderTaxPct(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Shipping</label>
                    <input type="number" value={manager.shippingCost || ""} onChange={(e) => manager.setShippingCost(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
            </div>

            <div className="flex flex-col border border-gray-100 rounded bg-white overflow-hidden">
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Sub Total</span><span>৳ {manager.totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Discount</span><span>{manager.totals.totalDiscount.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Order Tax</span><span>{manager.totals.tax} (%)</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Shipping</span><span>৳ {manager.totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>

                <div className="flex justify-between items-center text-[13px] font-medium text-blue-500 px-4 py-4 bg-gray-50/30">
                    <span>Grand Total</span><span>৳ {manager.totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
}