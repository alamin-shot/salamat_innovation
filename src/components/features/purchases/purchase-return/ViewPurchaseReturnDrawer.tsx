"use client";
import * as React from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/Button";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { computePurchaseTotals, countItems, formatPurchaseTaka, lineTotal } from "@/utils/purchaseMath";

interface ViewPurchaseReturnDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const amount = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Return invoice. Paid and Status are no longer part of returns; Due Amount stays. */
export function ViewPurchaseReturnDrawer({ id, isOpen, onClose }: ViewPurchaseReturnDrawerProps) {
    const record = useGlobalPurchasesStore((state) => state.purchaseReturns.find((item) => item.id === id) ?? null);
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Purchase_Return_${record?.invoiceNumber ?? "preview"}`,
    });

    const totals = record ? computePurchaseTotals(record.items, record.costing) : null;

    return (
        <Drawer
            title="Purchase Return Details Preview"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {record && totals ? (
                <div className="flex flex-col gap-2 p-4 pb-32 bg-brand-bg/10 min-h-full">
                    <div className="flex justify-end max-w-4xl mx-auto w-full">
                        <Button type="button" variant="success" onClick={() => handlePrint()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Invoice
                        </Button>
                    </div>

                    <div
                        ref={invoiceRef}
                        className="w-full max-w-4xl bg-white shadow-sm border border-brand-subtext/15 p-8 sm:p-10 flex flex-col gap-8 rounded-b-xl rounded-t-sm mx-auto print:shadow-none print:border-brand-subtext/15 print:border-t-8 print:border-t-orange-500 print:m-0"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 text-[13px] text-gray-700">
                                <h3 className="font-bold mb-2 text-xs text-gray-500 tracking-wider uppercase">Supplier Info</h3>
                                <p><span className="font-semibold inline-block w-16">Name</span> : {record.supplier}</p>
                                <p><span className="font-semibold inline-block w-16">Company</span> : {record.company}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-[13px] text-gray-700">
                                <h1 className="text-xl font-bold tracking-wider text-gray-800 mb-1">PURCHASE RETURN</h1>
                                <p><span className="font-semibold">Date :</span> {record.date}</p>
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="h-8 w-32 bg-gray-800" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                    <span className="text-[10px] mt-1 font-mono tracking-widest text-gray-500">{record.invoiceNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto mt-2">
                            <table className="w-full text-[13px] min-w-[600px]">
                                <thead>
                                    <tr className="text-gray-700 bg-gray-100">
                                        <th className="py-3 px-2 text-left font-bold w-10">#</th>
                                        <th className="py-3 px-2 text-left font-bold">Product</th>
                                        <th className="py-3 px-2 text-left font-bold">Serial/IMEI</th>
                                        <th className="py-3 px-2 text-center font-bold">Qty</th>
                                        <th className="py-3 px-2 text-right font-bold">Unit Price</th>
                                        <th className="py-3 px-2 text-right font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {record.items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100">
                                            <td className="py-4 px-2 align-top font-medium">{String(index + 1).padStart(2, "0")}</td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-start gap-3">
                                                    <div className="relative h-12 w-8 shrink-0 bg-white">
                                                        <Image src="/phone.png" alt="" fill sizes="32px" className="object-contain" />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="font-medium text-gray-800">{item.productName}</span>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {item.variant.split(" / ").filter(Boolean).map((part) => (
                                                                <span key={part} className="rounded border border-gray-200 px-2 py-0.5 text-[10px] text-emerald-600 bg-emerald-50/50">{part}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 align-top text-gray-600">{item.serial}</td>
                                            <td className="py-4 px-2 align-top text-center">1</td>
                                            <td className="py-4 px-2 align-top text-right">{amount(item.unitPrice)}</td>
                                            <td className="py-4 px-2 align-top text-right text-gray-800">{amount(lineTotal(item))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-2 border-t-2 border-gray-100 pt-6 text-[13px] text-gray-700">
                            <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
                                <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Total Quantity</span><span>: {countItems(record.items)} PCS</span></div>
                                <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Shipping Cost</span><span>: {formatPurchaseTaka(totals.shipping)}</span></div>
                                <div className="flex justify-between w-full sm:w-64"><span className="font-semibold">Tax</span><span>: {formatPurchaseTaka(totals.tax)}</span></div>
                            </div>

                            <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
                                <div className="flex justify-between"><span className="font-bold text-[14px]">Sub Total :</span><span className="font-bold text-[14px]">{formatPurchaseTaka(totals.subTotal)}</span></div>
                                <div className="flex justify-between text-gray-500 text-[12px]"><span>Deduction (-) :</span><span>{formatPurchaseTaka(totals.discount)}</span></div>
                                <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-gray-800"><span>Total (=) :</span><span>{formatPurchaseTaka(totals.total)}</span></div>
                                <div className="flex justify-between text-[12px]"><span>Due :</span><span>{formatPurchaseTaka(record.dueAmount)}</span></div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs italic text-gray-500 w-full">
                            Thank You For Your Business!
                        </div>
                    </div>
                </div>
            ) : null}
        </Drawer>
    );
}
