"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAddSaleManager } from "@/hooks/useAddSaleManager";
import { CustomSelect } from "../../../ui/CustomSelect";

type Manager = ReturnType<typeof useAddSaleManager>;

export function SaleSummarySection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Order Tax</label>
                    <input type="number" value={manager.orderTaxPct || ""} onChange={(e) => manager.setOrderTaxPct(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Shipping</label>
                    <input type="number" value={manager.shippingCost || ""} onChange={(e) => manager.setShippingCost(parseFloat(e.target.value) || 0)} placeholder="120.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Additional Charge Name</label>
                    <input type="text" value={manager.additionalChargeName} onChange={(e) => manager.setAdditionalChargeName(e.target.value)} placeholder="Name" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Additional Charge</label>
                    <input type="number" value={manager.additionalChargeAmount || ""} onChange={(e) => manager.setAdditionalChargeAmount(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500" />
                </div>
            </div>

            <div className="flex flex-col border border-gray-100 rounded bg-white overflow-hidden">
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Sub Total</span><span>৳ {manager.totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Discount</span><span>৳ {manager.totals.totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Order Tax</span><span>{manager.totals.tax} (%)</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Shipping</span><span>৳ {manager.totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100"><span>Additional Charge</span><span>৳ {manager.totals.additionalCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>

                <div className="flex justify-between items-center text-[13px] font-medium text-blue-500 px-4 py-4 bg-gray-50/30">
                    <span>Grand Total</span><span>৳ {manager.totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex flex-col gap-3 px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                    <label className="text-[12px] font-medium text-blue-500 mb-1">Received Amount</label>
                    {manager.payments.map((payment) => (
                        <div key={payment.id} className="grid grid-cols-2 gap-3">
                            <input type="number" value={payment.amount || ""} onChange={(e) => manager.updatePayment(payment.id, "amount", parseFloat(e.target.value) || 0)} placeholder="0" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500 bg-white" />
                            <CustomSelect value={payment.method} onChange={(v) => manager.updatePayment(payment.id, "method", v)} options={["Cash", "SSLCommerz", "Bank Transfer"]} placeholder="Choose a payment method" />
                        </div>
                    ))}
                    <div>
                        <Button variant="success" onClick={manager.addPaymentMethod} className="mt-2 text-[11px] h-7 px-3 py-1">+ Add Payment Method</Button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[13px] font-medium text-blue-500 px-4 py-3 border-t border-gray-100 bg-blue-50/30">
                    <span>Total Received</span><span>৳ {manager.totals.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium text-blue-500 px-4 py-3 border-t border-gray-100 bg-blue-50/30">
                    <span>Due Amount</span><span>৳ {manager.totals.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
}