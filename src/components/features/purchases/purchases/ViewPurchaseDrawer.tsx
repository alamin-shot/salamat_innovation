"use client";
import * as React from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useReactToPrint } from "react-to-print";

export function ViewPurchaseDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    // 1. Create a reference for the invoice container
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    // 2. Configure the print hook using the new v3 API (contentRef)
    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Purchase_Invoice_${id || "preview"}`,
    });

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Purchase Details Preview"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-brand-bg/10 min-h-full">
                {/* Print Action Bar */}
                <div className="flex justify-end max-w-3xl mx-auto w-full">
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                    >
                        <Printer className="h-4 w-4" /> Print Invoice
                    </button>
                </div>

                {/* Invoice Paper Document - Attach the ref here */}
                <div
                    ref={invoiceRef}
                    className="w-full max-w-3xl bg-white shadow-sm border border-brand-subtext/15 p-6 sm:p-8 flex flex-col gap-6 rounded-xl mx-auto print:shadow-none print:border-none print:m-0"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1 text-sm text-brand-text">
                            <h3 className="font-bold mb-2 text-xs text-brand-subtext tracking-wider uppercase">Supplier Info</h3>
                            <p><span className="font-semibold inline-block w-16">Name</span> : Rasel Raj</p>
                            <p><span className="font-semibold inline-block w-16">Phone</span> : 01966202121</p>
                            <p><span className="font-semibold inline-block w-16">Email</span> : -</p>
                            <p><span className="font-semibold inline-block w-16">Address</span> : -</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm">
                            <h1 className="text-2xl font-bold tracking-wider text-brand-text mb-1">PURCHASE</h1>
                            <p><span className="font-semibold">Date :</span> 2026-10-11</p>
                            <p><span className="font-semibold">Status :</span> Paid</p>
                            <div className="mt-2 flex flex-col items-center">
                                <div className="h-8 w-32 bg-brand-text" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                <span className="text-[9px] mt-1 font-mono tracking-widest text-brand-subtext">PP-001603</span>
                            </div>
                        </div>
                    </div>

                    {/* Item Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm min-w-[500px]">
                            <thead>
                                <tr className="border-y-2 border-brand-primary text-brand-text bg-brand-bg/30">
                                    <th className="py-2.5 px-2 text-left font-bold w-10">#</th>
                                    <th className="py-2.5 px-2 text-left font-bold">Product</th>
                                    <th className="py-2.5 px-2 text-left font-bold">Serial/IMEI</th>
                                    <th className="py-2.5 px-2 text-center font-bold">Qty</th>
                                    <th className="py-2.5 px-2 text-right font-bold">Unit Price</th>
                                    <th className="py-2.5 px-2 text-right font-bold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-brand-subtext/20">
                                    <td className="py-3 px-2 align-top">01</td>
                                    <td className="py-3 px-2">
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-10 w-8 shrink-0 bg-white">
                                                <Image src="/phone.png" alt="Phone" fill className="object-contain" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-brand-text">Galaxy S25 Ultra</span>
                                                <div className="flex gap-1.5">
                                                    <span className="rounded-full border border-brand-subtext/30 px-2 py-0.2 text-[9px] text-brand-subtext">Titanium Black</span>
                                                    <span className="rounded-full border border-brand-subtext/30 px-2 py-0.2 text-[9px] text-brand-subtext">12GB/512GB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 align-top font-mono text-xs text-brand-subtext">356899255860459</td>
                                    <td className="py-3 px-2 align-top text-center">1</td>
                                    <td className="py-3 px-2 align-top text-right">82,000.00</td>
                                    <td className="py-3 px-2 align-top text-right font-semibold">82,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Totals */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mt-4 border-t border-brand-subtext/20 pt-4 text-sm text-brand-text">
                        <div className="flex flex-col gap-2 w-full sm:w-1/2 text-xs">
                            <div className="flex justify-between w-full sm:w-56"><span className="font-semibold">Total Quantity</span><span>: 1 PCS</span></div>
                            <div className="flex justify-between w-full sm:w-56"><span className="font-semibold">Payment Method</span><span>: Cash</span></div>
                            <div className="flex justify-between w-full sm:w-56"><span className="font-semibold">Shipping Cost</span><span>: ৳ 0.00</span></div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-1/2 text-sm">
                            <div className="flex justify-between"><span className="font-bold">Total MRP :</span><span className="font-bold">৳ 82,000.00</span></div>
                            <div className="flex justify-between text-brand-subtext text-xs"><span>Total Discount (-) :</span><span>৳ 0.00</span></div>
                            <div className="flex justify-between font-semibold border-t border-brand-subtext/20 pt-2"><span>Grand Total (=) :</span><span>৳ 82,000.00</span></div>
                            <div className="flex justify-between text-xs"><span>Paid :</span><span>৳ 82,000.00</span></div>
                            <div className="flex justify-between text-xs"><span>Due :</span><span>৳ 0.00</span></div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs italic text-brand-subtext w-full">
                        Thank You For Your Business!
                    </div>
                </div>
            </div>
        </Drawer>
    );
}