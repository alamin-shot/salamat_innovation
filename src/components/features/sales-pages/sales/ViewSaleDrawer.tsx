"use client";
import * as React from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

export function ViewSaleDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Sale_Invoice_${id || "preview"}`,
    });

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Sale Details Preview"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-brand-bg/10 min-h-full">

                <div className="flex justify-end max-w-4xl mx-auto w-full">
                    <Button variant="success" onClick={() => handlePrint()} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print Invoice
                    </Button>
                </div>

                {/* Print Container with Thick Orange Border */}
                <div
                    ref={invoiceRef}
                    className="w-full max-w-4xl bg-white shadow-sm border border-brand-subtext/15 border-t-[8px] border-t-orange-500 p-8 sm:p-10 flex flex-col gap-8 rounded-b-xl rounded-t-sm mx-auto print:shadow-none print:border-brand-subtext/15 print:border-t-[8px] print:border-t-orange-500 print:m-0"
                >
                    {/* Header Details */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1 text-[12px] text-gray-700">
                            <h3 className="font-bold mb-1 text-gray-800">Bill To</h3>
                            <p><span className="font-semibold inline-block w-16">Name</span> : Md Shakhiur Rahman Tamal</p>
                            <p><span className="font-semibold inline-block w-16">Business</span> : -</p>
                            <p><span className="font-semibold inline-block w-16">Phone</span> : 01738293038</p>
                            <p><span className="font-semibold inline-block w-16">Email</span> : tanvirxn@gmail.com</p>
                            <p><span className="font-semibold inline-block w-16">Address</span> : Pakutia zamidar bari, Nagarpur, Tangail, 1936</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[12px] text-gray-700">
                            <h1 className="text-2xl font-bold tracking-wider text-gray-800 mb-1">INVOICE</h1>
                            <p><span className="font-semibold">Date :</span> 2026-10-12</p>
                            <p><span className="font-semibold">Tracking No :</span></p>
                            <div className="mt-2 flex flex-col items-center">
                                {/* Simulated Barcode */}
                                <div className="h-10 w-36 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                <span className="text-[10px] mt-1 font-mono tracking-widest text-gray-500">PS-003268</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
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
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-2 align-top font-medium">01</td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-12 w-12 shrink-0 bg-white">
                                                {/* Placeholder for cable image */}
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                    <span className="text-2xl rotate-45">/</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-medium text-gray-800 text-[13px]">VOLTME PowerLink RUGG C to C</span>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600 bg-gray-50">Black</span>
                                                    <span className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600 bg-gray-50">1.8M/ 3A/ 60W</span>
                                                </div>
                                                <span className="text-[10px] text-gray-500 mt-1">Warranty Days: 545</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 align-top text-gray-600 font-mono text-[11px] leading-relaxed">
                                        0000442916<br />
                                        0000442851<br />
                                        0000442841<br />
                                        0000442829<br />
                                        0000443019
                                    </td>
                                    <td className="py-4 px-2 align-top text-center">5</td>
                                    <td className="py-4 px-2 align-top text-right text-gray-600 leading-relaxed">
                                        1,200.00<br />1,200.00<br />1,200.00<br />1,200.00<br />1,200.00
                                    </td>
                                    <td className="py-4 px-2 align-top text-right text-gray-600 leading-relaxed">
                                        850.00<br />850.00<br />850.00<br />850.00<br />850.00
                                    </td>
                                    <td className="py-4 px-2 align-top text-right text-gray-800 leading-relaxed">
                                        350<br />350<br />350<br />350<br />350
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Calculations */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-4 border-t-2 border-gray-100 pt-6 text-[12px] text-gray-700">
                        <div className="flex flex-col gap-3 w-full sm:w-1/2 pr-4">
                            <div className="flex justify-between"><span className="font-semibold">Total Quantity</span><span>: 5 PCS</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Payment Method & (Due)</span><span>: ৳ 0.00</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Additional Charge</span><span>: ৳ 0.00</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Shipping Charge</span><span>: ৳ 120.00</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Order Tax</span><span>: ৳ 0.00</span></div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full sm:w-[280px]">
                            <div className="flex justify-between items-center"><span className="font-bold text-[14px] text-gray-900">Total MRP :</span><span className="font-bold text-[15px] text-gray-900">৳ 6,000.00</span></div>
                            <div className="flex justify-between text-gray-600 mt-1"><span>Coupon Amount :</span><span>৳ 0.00</span></div>
                            <div className="flex justify-between text-gray-600"><span>Total Discount (-) :</span><span>৳ 4,250.00</span></div>
                            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2 mt-1"><span>Total Balance (=) :</span><span>৳ 1,870.00</span></div>
                            <div className="flex justify-between text-gray-600 mt-1"><span>Paid :</span><span>৳ 0.00</span></div>
                            <div className="flex justify-between font-medium text-gray-800"><span>Due :</span><span>৳ 1,870.00</span></div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-[11px] italic text-gray-500 w-full">
                        Thank You For Your Purchase!
                    </div>
                </div>
            </div>
        </Drawer>
    );
}