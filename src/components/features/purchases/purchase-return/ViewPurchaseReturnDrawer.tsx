"use client";
import * as React from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useReactToPrint } from "react-to-print";

export function ViewPurchaseReturnDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Purchase_Return_${id || "preview"}`,
    });

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Purchase Return Details Preview"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-brand-bg/10 min-h-full">

                <div className="flex justify-end max-w-4xl mx-auto w-full">
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-2 rounded bg-[#108c5d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 shadow-sm"
                    >
                        <Printer className="h-4 w-4" /> Print Invoice
                    </button>
                </div>

                {/* Print Container with Thick Orange Border */}
                <div
                    ref={invoiceRef}
                    className="w-full max-w-4xl bg-white shadow-sm border border-brand-subtext/15 p-8 sm:p-10 flex flex-col gap-8 rounded-b-xl rounded-t-sm mx-auto print:shadow-none print:border-brand-subtext/15 print:border-t-[8px] print:border-t-orange-500 print:m-0"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1 text-[13px] text-gray-700">
                            <h3 className="font-bold mb-2 text-xs text-gray-500 tracking-wider uppercase">Supplier Info</h3>
                            <p><span className="font-semibold inline-block w-16">Name</span> : World Trade Center</p>
                            <p><span className="font-semibold inline-block w-16">Phone</span> : 01671915818</p>
                            <p><span className="font-semibold inline-block w-16">Email</span> : -</p>
                            <p><span className="font-semibold inline-block w-16">Address</span> : Gulshan</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[13px] text-gray-700">
                            <h1 className="text-xl font-bold tracking-wider text-gray-800 mb-1">PURCHASE RETURN</h1>
                            <p><span className="font-semibold">Date :</span> 2026-10-08</p>
                            <p><span className="font-semibold">Status :</span> Due</p>
                            <div className="mt-2 flex flex-col items-center">
                                <div className="h-8 w-32 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                <span className="text-[10px] mt-1 font-mono tracking-widest text-gray-500">PR-000107</span>
                            </div>
                        </div>
                    </div>

                    {/* Table matches the gray header from the image */}
                    <div className="w-full overflow-x-auto mt-2">
                        <table className="w-full text-[13px] min-w-[600px]">
                            <thead>
                                <tr className="text-gray-700 bg-gray-100">
                                    <th className="py-3 px-2 text-left font-bold w-10">#</th>
                                    <th className="py-3 px-2 text-left font-bold">Product</th>
                                    <th className="py-3 px-2 text-left font-bold">Serial/IMEI</th>
                                    <th className="py-3 px-2 text-center font-bold">Qty</th>
                                    <th className="py-3 px-2 text-right font-bold">Unit Price</th>
                                    <th className="py-3 px-2 text-right font-bold">Discount</th>
                                    <th className="py-3 px-2 text-right font-bold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-2 align-top font-medium">01</td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-12 w-8 shrink-0 bg-white">
                                                <Image src="/phone.png" alt="Phone" fill className="object-contain" />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-medium text-gray-800">Oppo A6x</span>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className="rounded border border-gray-200 px-2 py-0.5 text-[10px] text-emerald-600 bg-emerald-50/50">4GB/64GB</span>
                                                    <span className="rounded border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500 bg-gray-50">Plum Purple</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 align-top text-gray-600">862672084151797</td>
                                    <td className="py-4 px-2 align-top text-center">1</td>
                                    <td className="py-4 px-2 align-top text-right">18,990.00</td>
                                    <td className="py-4 px-2 align-top text-right">0.00</td>
                                    <td className="py-4 px-2 align-top text-right text-gray-800">18,990</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-2 border-t-2 border-gray-100 pt-6 text-[13px] text-gray-700">
                        <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
                            <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Total Quantity</span><span>: 4 PCS</span></div>
                            <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Payment Method & (Due)</span><span>: ৳ 0.00</span></div>
                            <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Shipping Cost</span><span>: ৳ 0.00</span></div>
                            <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Order Tax</span><span>: ৳ 0.00</span></div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
                            <div className="flex justify-between"><span className="font-bold text-[14px]">Total MRP :</span><span className="font-bold text-[14px]">৳ 1,13,840.00</span></div>
                            <div className="flex justify-between text-gray-500 text-[12px]"><span>Total Discount (-) :</span><span>৳ 0.00</span></div>
                            <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-gray-800"><span>Grand Total (=) :</span><span>৳ 1,13,840.00</span></div>
                            <div className="flex justify-between text-[12px]"><span>Paid :</span><span>৳ 0.00</span></div>
                            <div className="flex justify-between text-[12px]"><span>Due :</span><span>৳ 1,13,840.00</span></div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs italic text-gray-500 w-full">
                        Thank You For Your Business!
                    </div>
                </div>
            </div>
        </Drawer>
    );
}