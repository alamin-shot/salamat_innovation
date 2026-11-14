import * as React from "react";
import { Lock, ScanLine } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { SaleReturnFormManager } from "@/hooks/sales_hooks/useSaleReturnForm";
import { SaleReturnItemRow } from "./SaleReturnItemRow";

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500";
const HEAD = "bg-gray-50 font-semibold text-gray-600";
const money = (value: number) => `৳ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

/** Shared by Add Sale Return and Edit Sale Return. The customer is shown locked, never chosen. */
export function SaleReturnEditor({ form }: { form: SaleReturnFormManager }) {
    return (
        <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Customer</label>
                    <div className={`flex h-[38px] items-center gap-2 rounded border px-3 text-[13px] ${form.customer ? "border-emerald-200 bg-emerald-50/60 font-medium text-emerald-800" : "border-gray-100 bg-gray-50 text-gray-400"}`}>
                        {form.customer && <Lock className="h-3.5 w-3.5" />}
                        {form.customer ? form.customer.name : "Filled from the original sale of the first scanned item"}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                    <DatePicker value={form.date} onChange={form.setDate} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[13px] text-gray-500">Product</label>
                <div className="relative mb-2">
                    <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={form.scanQuery}
                        onChange={(e) => form.setScanQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); form.scan(); } }}
                        placeholder="Scan a sold Serial/IMEI, or type an invoice number (PS-… / INV-…), then Enter"
                        className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="rounded border border-gray-200 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className={`w-12 ${HEAD}`}>SL</TableHeadCell>
                            <TableHeadCell className={HEAD}>Product Name</TableHeadCell>
                            <TableHeadCell className={HEAD}>SKU</TableHeadCell>
                            <TableHeadCell className={HEAD}>Serial/IMEI no.</TableHeadCell>
                            <TableHeadCell className={HEAD}>Sale Invoice</TableHeadCell>
                            <TableHeadCell className={HEAD}>Price Paid</TableHeadCell>
                            <TableHeadCell className={HEAD}>Refund</TableHeadCell>
                            <TableHeadCell className={`text-right w-[80px] ${HEAD}`}>Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {form.items.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-8 text-[13px] text-gray-500">No products added for return</TableCell></TableRow>
                            ) : form.items.map((item, index) => (
                                <SaleReturnItemRow key={item.id} item={item} index={index} onRefund={form.setRefund} onRemove={form.removeItem} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Discount</label>
                        <input type="number" min="0" value={form.discount || ""} onChange={(e) => form.setDiscount(Number(e.target.value) || 0)} placeholder="0.00" className={INPUT} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Order Tax (%)</label>
                        <input type="number" min="0" value={form.orderTaxPct || ""} onChange={(e) => form.setOrderTaxPct(Number(e.target.value) || 0)} placeholder="0.00" className={INPUT} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Shipping</label>
                        <input type="number" min="0" value={form.shippingCost || ""} onChange={(e) => form.setShippingCost(Number(e.target.value) || 0)} placeholder="0.00" className={INPUT} />
                    </div>
                </div>

                <div className="flex flex-col border border-gray-100 rounded bg-white">
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100"><span>Sub Total</span><span>{money(form.totals.subTotal)}</span></div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100"><span>Discount (-)</span><span>{money(form.totals.discount)}</span></div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100"><span>Order Tax ({form.orderTaxPct}%)</span><span>{money(form.totals.tax)}</span></div>
                    <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100"><span>Shipping</span><span>{money(form.totals.shipping)}</span></div>
                    <div className="flex justify-between items-center text-[13px] font-semibold text-blue-500 p-3.5"><span>Total Refund</span><span>{money(form.totals.total)}</span></div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button variant="success" onClick={form.save} className="px-8">{form.isEdit ? "Update Return" : "Save Return"}</Button>
            </div>
        </div>
    );
}
