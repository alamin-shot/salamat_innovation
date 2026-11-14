"use client";
import * as React from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/Button";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { computePurchaseTotals, countItems, formatPurchaseTaka, lineTotal } from "@/utils/purchaseMath";
import { PurchaseStatusBadge } from "../shared/PurchaseStatusBadge";

interface ViewPurchaseDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const amount = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ViewPurchaseDrawer({ id, isOpen, onClose }: ViewPurchaseDrawerProps) {
    const purchase = useGlobalPurchasesStore((state) => state.purchases.find((record) => record.id === id) ?? null);
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Purchase_Invoice_${purchase?.invoiceNumber ?? "preview"}`,
    });

    const totals = purchase ? computePurchaseTotals(purchase.items, purchase.costing) : null;

    return (
        <Drawer
            title="Purchase Details Preview"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            {purchase && totals ? (
                <div className="flex flex-col gap-2 p-4 pb-32 bg-brand-bg/10 min-h-full">
                    <div className="flex justify-end max-w-3xl mx-auto w-full">
                        <Button type="button" variant="success" onClick={() => handlePrint()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Invoice
                        </Button>
                    </div>

                    <div
                        ref={invoiceRef}
                        className="w-full max-w-3xl bg-white shadow-sm border border-brand-subtext/15 p-6 sm:p-8 flex flex-col gap-2 rounded-xl mx-auto print:shadow-none print:border-none print:m-0"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 text-sm text-brand-text">
                                <h3 className="font-bold mb-2 text-xs text-brand-subtext tracking-wider uppercase">Supplier Info</h3>
                                <p><span className="font-semibold inline-block w-16">Name</span> : {purchase.supplier}</p>
                                <p><span className="font-semibold inline-block w-16">Location</span> : {purchase.location}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-sm">
                                <h1 className="text-2xl font-bold tracking-wider text-brand-text mb-1">PURCHASE</h1>
                                <p><span className="font-semibold">Date :</span> {purchase.date}</p>
                                <p className="flex items-center gap-1.5"><span className="font-semibold">Status :</span> <PurchaseStatusBadge status={purchase.status} /></p>
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="h-8 w-32 bg-brand-text" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 6px, #fff 6px, #fff 10px, transparent 10px, transparent 12px)' }}></div>
                                    <span className="text-[9px] mt-1 font-mono tracking-widest text-brand-subtext">{purchase.invoiceNumber}</span>
                                </div>
                            </div>
                        </div>

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
                                    {purchase.items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-brand-subtext/20">
                                            <td className="py-3 px-2 align-top">{String(index + 1).padStart(2, "0")}</td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-start gap-3">
                                                    <div className="relative h-10 w-8 shrink-0 bg-white">
                                                        <Image src="/phone.png" alt="" fill sizes="32px" className="object-contain" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-brand-text">{item.productName}</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {item.variant.split(" / ").filter(Boolean).map((part) => (
                                                                <span key={part} className="rounded-full border border-brand-subtext/30 px-2 py-0.5 text-[9px] text-brand-subtext">{part}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 align-top font-mono text-xs text-brand-subtext">{item.serial}</td>
                                            <td className="py-3 px-2 align-top text-center">1</td>
                                            <td className="py-3 px-2 align-top text-right">{amount(item.unitPrice)}</td>
                                            <td className="py-3 px-2 align-top text-right font-semibold">{amount(lineTotal(item))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mt-4 border-t border-brand-subtext/20 pt-4 text-sm text-brand-text">
                            <div className="flex flex-col gap-2 w-full sm:w-1/2 text-xs">
                                <div className="flex justify-between w-full sm:w-56"><span className="font-semibold">Total Quantity</span><span>: {countItems(purchase.items)} PCS</span></div>
                                <div className="flex justify-between w-full sm:w-56"><span className="font-semibold">Created By</span><span>: {purchase.createdBy}</span></div>
                            </div>

                            <div className="flex flex-col gap-2 w-full sm:w-1/2 text-sm">
                                <div className="flex justify-between"><span className="font-bold">Sub Total :</span><span className="font-bold">{formatPurchaseTaka(totals.subTotal)}</span></div>
                                <div className="flex justify-between text-brand-subtext text-xs"><span>Discount (-) :</span><span>{formatPurchaseTaka(totals.discount)}</span></div>
                                <div className="flex justify-between text-brand-subtext text-xs"><span>Tax (+) :</span><span>{formatPurchaseTaka(totals.tax)}</span></div>
                                <div className="flex justify-between text-brand-subtext text-xs"><span>Shipping (+) :</span><span>{formatPurchaseTaka(totals.shipping)}</span></div>
                                <div className="flex justify-between font-semibold border-t border-brand-subtext/20 pt-2"><span>Total (=) :</span><span>{formatPurchaseTaka(totals.total)}</span></div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs italic text-brand-subtext w-full">
                            Thank You For Your Business!
                        </div>
                    </div>
                </div>
            ) : null}
        </Drawer>
    );
}
