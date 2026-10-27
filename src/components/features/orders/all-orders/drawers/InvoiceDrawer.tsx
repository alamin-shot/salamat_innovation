"use client";
import { useRef } from "react";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PrintableInvoice } from "./PrintableInvoice";

export function InvoiceDrawer({ manager }: { manager: OrderManagerType }) {
    const order = manager.getActiveOrder();

    // ── The ref belongs to the ISOLATED PrintableInvoice, never to the Drawer. ──
    // This guarantees react-to-print's iframe clones only the clean paper layout,
    // not the Drawer's `fixed`, `overflow-y-auto`, or transition classes.
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: order ? `Invoice_${order.orderNumber}` : "Invoice",
        pageStyle: `
            @page {
                size: A4 portrait;
                margin: 10mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `,
    });

    if (!order) return null;

    return (
        <>
            {/*
             * ── STEP 1: THE ISOLATED PURE PRINT COMPONENT ──────────────────────
             * Rendered OUTSIDE the Drawer. Hidden from the UI via `hidden` inside
             * PrintableInvoice. The iframe clones only this node — zero Drawer CSS.
             */}
            <PrintableInvoice order={order} printRef={printRef} />

            {/*
             * ── STEP 2: THE WEB UI DRAWER (preview only, no ref) ───────────────
             * This is purely for the human looking at the screen. It has no printRef
             * and is never touched by react-to-print.
             */}
            <Drawer
                title="Order Details Preview"
                isOpen={manager.activeDrawer === "invoice"}
                onClose={manager.closeDrawer}
                width="w-full sm:w-[calc(100vw-260px)]"
            >
                <div className="flex flex-col h-full bg-gray-100/50 -m-6 p-6 overflow-y-auto">

                    {/* Print Button */}
                    <div className="flex justify-end mb-4 max-w-4xl mx-auto w-full">
                        <Button
                            variant="success"
                            className="gap-2 h-9 px-4 shadow-sm"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4" /> Print Invoice
                        </Button>
                    </div>

                    {/* ── Screen Preview (decorative — NOT the print source) ─── */}
                    <div className="bg-white shadow-lg rounded-sm w-full max-w-4xl mx-auto p-8 md:p-12 min-h-[1056px] border border-gray-200">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-6 mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter text-emerald-600">TEKZO</h2>
                                <p className="text-xs text-gray-500">www.tekzo.com.bd</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-3xl font-light text-gray-400">INVOICE</h1>
                                <p className="text-sm font-semibold mt-1">Date: <span className="font-normal text-gray-600">{order.date}</span></p>
                                <p className="text-sm font-semibold">Tracking No: <span className="font-normal text-gray-600">{order.orderNumber}</span></p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="mb-10 text-sm">
                            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">Bill To</h3>
                            <div className="grid grid-cols-[100px_1fr] gap-y-1">
                                <span className="font-semibold text-gray-600">Name</span> <span>: {order.customerName}</span>
                                <span className="font-semibold text-gray-600">Phone</span> <span>: {order.customerPhone}</span>
                                <span className="font-semibold text-gray-600">Email</span> <span>: {order.customerEmail || "—"}</span>
                                <span className="font-semibold text-gray-600">Address</span> <span>: {order.customerAddress || "—"}</span>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full text-sm mb-8 border-collapse">
                            <thead className="bg-gray-100 text-gray-600 font-semibold text-left">
                                <tr>
                                    <th className="py-2 px-3 rounded-l-md">#</th>
                                    <th className="py-2 px-3">Product</th>
                                    <th className="py-2 px-3 text-center">Quantity</th>
                                    <th className="py-2 px-3 text-right">MRP</th>
                                    <th className="py-2 px-3 text-right">Discount</th>
                                    <th className="py-2 px-3 text-right rounded-r-md">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={item.id} className="border-b border-gray-50">
                                        <td className="py-3 px-3 text-gray-500">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td className="py-3 px-3">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-[11px] text-gray-500 bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-0.5 border border-gray-200">{item.variant}</div>
                                        </td>
                                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                                        <td className="py-3 px-3 text-right">{item.unitPrice.toFixed(2)}</td>
                                        <td className="py-3 px-3 text-right">{item.discount.toFixed(2)}</td>
                                        <td className="py-3 px-3 text-right font-medium">{item.lineTotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary */}
                        <div className="flex flex-col md:flex-row justify-between bg-gray-50 p-6 rounded-lg text-sm border border-gray-100">
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-gray-600">
                                <span className="font-semibold">Total Quantity</span> <span>: {order.items.reduce((s, i) => s + i.quantity, 0)} PCS</span>
                                <span className="font-semibold">Payment Method</span> <span>: {order.pm.toUpperCase()}</span>
                                <span className="font-semibold">Shipping Charge (+)</span> <span>: ৳ 70.00</span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-right mt-4 md:mt-0">
                                <span className="font-semibold text-gray-600">Total MRP :</span> <span className="font-bold text-gray-900">৳ {order.billAmount.toFixed(2)}</span>
                                <span className="font-semibold text-gray-600">Total Discount (-) :</span> <span className="text-gray-900">৳ {(order.billAmount - order.grandTotal).toFixed(2)}</span>
                                <span className="font-semibold text-gray-600">Total Balance (=) :</span> <span className="font-bold text-emerald-600 text-base">৳ {order.grandTotal.toFixed(2)}</span>
                                <span className="font-semibold text-gray-600 mt-2">Paid :</span> <span className="text-gray-900 mt-2">৳ {order.payableAmount.toFixed(2)}</span>
                                <span className="font-semibold text-gray-600">Due :</span> <span className="text-red-600 font-bold">৳ {order.dueAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Policy Footer */}
                        <div className="mt-12 text-[10px] text-gray-500 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                            <p><strong className="text-gray-700">Shipping Policy:</strong> Any increase in shipping costs due to order weight increasing by 1 kg or more must be fully covered by the customer.</p>
                            <p className="mt-1"><strong className="text-gray-700">Payment Policy:</strong> Orders with an advance payment will be shipped via Cash on Delivery (COD), and the customer must pay the remaining balance upon receiving the product.</p>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}