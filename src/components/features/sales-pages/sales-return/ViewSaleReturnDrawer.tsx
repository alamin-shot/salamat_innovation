"use client";
import * as React from "react";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

export function ViewSaleReturnDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const printRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Sale_Return_${id || "preview"}`,
    });

    if (!id && !isOpen) return null;

    return (
        <Drawer title="Sale Return Details Preview" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-brand-bg/10 min-h-full pb-12">

                <div className="flex justify-end max-w-4xl mx-auto w-full">
                    <Button variant="success" onClick={() => handlePrint()} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print Invoice
                    </Button>
                </div>

                <div
                    ref={printRef}
                    className="w-full max-w-4xl bg-white shadow-sm border border-brand-subtext/15 border-t-[8px] border-t-orange-500 p-8 sm:p-10 flex flex-col gap-8 rounded-b-xl rounded-t-sm mx-auto print:shadow-none print:m-0"
                >
                    {/* Header Details */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1 text-[12px] text-gray-700">
                            <h3 className="font-bold mb-1 text-gray-800">Bill To</h3>
                            <p><span className="font-semibold inline-block w-16">Name</span> : MD MINHAZUL ISLAM RIFAT</p>
                            <p><span className="font-semibold inline-block w-16">Business</span> : -</p>
                            <p><span className="font-semibold inline-block w-16">Phone</span> : +8801622929749</p>
                            <p><span className="font-semibold inline-block w-16">Email</span> : minhazul.mi@gmail.com</p>
                            <p><span className="font-semibold inline-block w-16">Address</span> : -</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[12px] text-gray-700">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-gray-800 mb-1">SALE RETURN</h1>
                            <p><span className="font-semibold">Date :</span> 2026-10-10</p>
                            <p><span className="font-semibold">Status :</span> Due</p>
                            <div className="mt-2 flex flex-col items-center">
                                <div className="h-10 w-36 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                <span className="text-[10px] mt-1 font-mono tracking-widest text-gray-500">SR-000293</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto mt-2">
                        <table className="w-full text-[12px] min-w-[600px]">
                            <thead>
                                <tr className="border-y-2 border-orange-500 text-gray-700 bg-gray-50/50">
                                    <th className="py-3 px-2 text-left font-bold w-10">#</th>
                                    <th className="py-3 px-2 text-left font-bold">Product</th>
                                    <th className="py-3 px-2 text-left font-bold">Serial/IMEI</th>
                                    <th className="py-3 px-2 text-center font-bold">Qty</th>
                                    <th className="py-3 px-2 text-right font-bold">MRP</th>
                                    <th className="py-3 px-2 text-right font-bold">Discount</th>
                                    <th className="py-3 px-2 text-right font-bold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-2 align-top font-medium">01</td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-12 w-12 shrink-0 bg-white flex items-center justify-center text-gray-300">
                                                <span className="text-2xl rotate-45">/</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-medium text-gray-800 text-[13px]">QCY Type C-L 27W Charging Cable</span>
                                                <span className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600 bg-gray-50 w-max">Black</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 align-top text-gray-600 font-mono text-[11px] leading-relaxed">
                                        4516192621<br />7627187010
                                    </td>
                                    <td className="py-4 px-2 align-top text-center">2</td>
                                    <td className="py-4 px-2 align-top text-right text-gray-600 leading-relaxed">
                                        550.00<br />550.00
                                    </td>
                                    <td className="py-4 px-2 align-top text-right text-gray-600 leading-relaxed">
                                        50.00<br />50.00
                                    </td>
                                    <td className="py-4 px-2 align-top text-right text-gray-800 leading-relaxed">
                                        500<br />500
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Math */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-4 border-t-2 border-gray-100 pt-6 text-[12px] text-gray-700">
                        <div className="flex flex-col gap-3 w-full sm:w-1/2 pr-4">
                            <div className="flex justify-between"><span className="font-semibold">Total Quantity</span><span>: 2 PCS</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Shipping Charge</span><span>: ৳ 0.00</span></div>
                            <div className="flex justify-between"><span className="font-semibold">Order Tax</span><span>: ৳ 0.00</span></div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full sm:w-[280px]">
                            <div className="flex justify-between items-center"><span className="font-bold text-[14px] text-gray-900">Total MRP :</span><span className="font-bold text-[15px] text-gray-900">৳ 1,100.00</span></div>
                            <div className="flex justify-between text-gray-600 mt-1"><span>Total Discount (-) :</span><span>৳ 100.00</span></div>
                            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2 mt-1"><span>Grand Total (=) :</span><span>৳ 1,000.00</span></div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-[11px] italic text-gray-500 w-full">
                        Thank You For your Purchase!
                    </div>
                </div>
            </div>
        </Drawer>
    );
}