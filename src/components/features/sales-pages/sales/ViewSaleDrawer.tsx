"use client";
import * as React from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { usePeopleStore } from "@/store/usePeopleStore";
import { SaleRow } from "@/types/sales";

const money = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Printable invoice of one sale, built from the stored record and the customer's People profile. */
export function ViewSaleDrawer({ sale, isOpen, onClose }: { sale: SaleRow | null; isOpen: boolean; onClose: () => void }) {
    const invoiceRef = React.useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef: invoiceRef, documentTitle: `Sale_Invoice_${sale?.invoiceNumber ?? "preview"}` });
    const customer = usePeopleStore((state) => state.people.find((person) => person.id === sale?.customerId) ?? null);

    return (
        <Drawer title="Sale Details Preview" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {sale && (
                <div className="flex flex-col gap-2 p-4 pb-32 bg-brand-bg/10 min-h-full">
                    <div className="flex justify-end max-w-4xl mx-auto w-full">
                        <Button variant="success" onClick={() => handlePrint()} className="flex items-center gap-2"><Printer className="h-4 w-4" /> Print Invoice</Button>
                    </div>

                    <div ref={invoiceRef} className="w-full max-w-4xl bg-white shadow-sm border border-brand-subtext/15 border-t-8 border-t-orange-500 p-8 sm:p-10 flex flex-col gap-8 rounded-b-xl rounded-t-sm mx-auto print:shadow-none print:m-0">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 text-[12px] text-gray-700">
                                <h3 className="font-bold mb-1 text-gray-800">Bill To</h3>
                                <p><span className="font-semibold inline-block w-16">Name</span> : {sale.customerName}</p>
                                <p><span className="font-semibold inline-block w-16">Business</span> : {customer?.businessName ?? "-"}</p>
                                <p><span className="font-semibold inline-block w-16">Phone</span> : {customer?.phoneNumber ?? "-"}</p>
                                <p><span className="font-semibold inline-block w-16">Email</span> : {customer?.email ?? "-"}</p>
                                <p><span className="font-semibold inline-block w-16">Address</span> : {sale.address || "-"}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-[12px] text-gray-700">
                                <h1 className="text-2xl font-bold tracking-wider text-gray-800 mb-1">INVOICE</h1>
                                <p><span className="font-semibold">Date :</span> {sale.date}</p>
                                <p><span className="font-semibold">Seller :</span> {sale.seller}</p>
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="h-10 w-36 bg-gray-800" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)" }} />
                                    <span className="text-[10px] mt-1 font-mono tracking-widest text-gray-500">{sale.invoiceNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto mt-2">
                            <table className="w-full text-[12px] min-w-[600px]">
                                <thead>
                                    <tr className="border-y-2 border-orange-500 text-gray-700 bg-gray-50/50">
                                        <th className="py-3 px-2 text-left font-bold w-10">#</th>
                                        <th className="py-3 px-2 text-left font-bold">Product</th>
                                        <th className="py-3 px-2 text-left font-bold">Serial Number</th>
                                        <th className="py-3 px-2 text-center font-bold">Qty</th>
                                        <th className="py-3 px-2 text-right font-bold">MRP</th>
                                        <th className="py-3 px-2 text-right font-bold">Discount</th>
                                        <th className="py-3 px-2 text-right font-bold">Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100">
                                            <td className="py-3 px-2 align-top font-medium">{String(index + 1).padStart(2, "0")}</td>
                                            <td className="py-3 px-2">
                                                <span className="font-medium text-gray-800 text-[13px]">{item.productName}</span>
                                                <div className="mt-1 flex gap-1.5 flex-wrap">
                                                    {item.variant.split("/").map((part) => part.trim()).filter(Boolean).map((part) => (
                                                        <span key={part} className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600 bg-gray-50">{part}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 align-top text-gray-600 font-mono text-[11px]">{item.serial}</td>
                                            <td className="py-3 px-2 align-top text-center">1</td>
                                            <td className="py-3 px-2 align-top text-right text-gray-600">{money(item.mrp)}</td>
                                            <td className="py-3 px-2 align-top text-right text-gray-600">{money(Math.max(0, item.mrp - item.salePrice))}</td>
                                            <td className="py-3 px-2 align-top text-right text-gray-800">{money(item.salePrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-4 border-t-2 border-gray-100 pt-6 text-[12px] text-gray-700">
                            <div className="flex flex-col gap-3 w-full sm:w-1/2 pr-4">
                                <div className="flex justify-between"><span className="font-semibold">Total Quantity</span><span>: {sale.items.length} PCS</span></div>
                                <div className="flex justify-between"><span className="font-semibold">Payment Method</span><span>: {sale.paymentMethods}</span></div>
                                <div className="flex justify-between"><span className="font-semibold">{sale.additionalChargeName || "Additional Charge"}</span><span>: ৳ {money(sale.totals.additionalCharge)}</span></div>
                                <div className="flex justify-between"><span className="font-semibold">Shipping Charge</span><span>: ৳ {money(sale.totals.shipping)}</span></div>
                                <div className="flex justify-between"><span className="font-semibold">Order Tax ({sale.orderTaxPct}%)</span><span>: ৳ {money(sale.totals.tax)}</span></div>
                            </div>
                            <div className="flex flex-col gap-2.5 w-full sm:w-[280px]">
                                <div className="flex justify-between items-center"><span className="font-bold text-[14px] text-gray-900">Sub Total :</span><span className="font-bold text-[15px] text-gray-900">৳ {money(sale.totals.subTotal)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Discount from MRP :</span><span>৳ {money(sale.totals.totalDiscount)}</span></div>
                                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2 mt-1"><span>Total (=) :</span><span>৳ {money(sale.totals.grandTotal)}</span></div>
                                <div className="flex justify-between text-gray-600 mt-1"><span>Paid :</span><span>৳ {money(sale.totals.received)}</span></div>
                                <div className="flex justify-between font-medium text-gray-800"><span>Due :</span><span>৳ {money(sale.totals.due)}</span></div>
                            </div>
                        </div>

                        <div className="mt-12 text-center text-[11px] italic text-gray-500 w-full">Thank You For Your Purchase!</div>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
