// Pure print-only component — no web-UI classes, no viewport units.
// This component is intentionally hidden from the screen with `hidden`
// but lives in the DOM so react-to-print can clone it into its iframe.
import { OrderRecord } from "@/store/useOrderStore";
import React from "react";

interface PrintableInvoiceProps {
    order: OrderRecord;
    printRef: React.RefObject<HTMLDivElement | null>;
}

export function PrintableInvoice({ order, printRef }: PrintableInvoiceProps) {
    const totalDiscount = order.billAmount - order.grandTotal;
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        // `hidden` hides it from the web UI; react-to-print still clones the inner ref.
        <div className="hidden">
            {/*
             * PHYSICAL PAPER WRAPPER
             * - w-[210mm]: strict A4 width — no viewport-relative units
             * - min-h-[297mm]: allows content to grow beyond one page naturally
             * - bg-white text-black: explicit; don't rely on inherited browser defaults
             * - p-[18mm]: inner margin that supplements the @page margin
             */}
            <div
                ref={printRef}
                className="w-[210mm] min-h-[297mm] bg-white text-black mx-auto p-[18mm] font-sans"
            >
                {/* ── HEADER ─────────────────────────────────────────────── */}
                <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-5 mb-7">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-emerald-600">TEKZO</h2>
                        <p className="text-[10px] text-gray-500">www.tekzo.com.bd</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-light text-gray-400">INVOICE</h1>
                        <p className="text-xs font-semibold mt-1">
                            Date: <span className="font-normal text-gray-600">{order.date}</span>
                        </p>
                        <p className="text-xs font-semibold">
                            Tracking No:{" "}
                            <span className="font-normal text-gray-600">{order.orderNumber}</span>
                        </p>
                    </div>
                </div>

                {/* ── BILL TO ────────────────────────────────────────────── */}
                <div className="mb-8 text-xs">
                    <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                        Bill To
                    </h3>
                    <div className="grid grid-cols-[90px_1fr] gap-y-1">
                        <span className="font-semibold text-gray-600">Name</span>
                        <span>: {order.customerName}</span>
                        <span className="font-semibold text-gray-600">Phone</span>
                        <span>: {order.customerPhone}</span>
                        <span className="font-semibold text-gray-600">Email</span>
                        <span>: {order.customerEmail || "—"}</span>
                        <span className="font-semibold text-gray-600">Address</span>
                        <span>: {order.customerAddress || "—"}</span>
                    </div>
                </div>

                {/* ── ITEMS TABLE ────────────────────────────────────────── */}
                <table className="w-full text-xs mb-7 border-collapse">
                    <thead className="bg-gray-100 text-gray-600 font-semibold text-left">
                        <tr>
                            <th className="py-2 px-2 rounded-l-sm">#</th>
                            <th className="py-2 px-2">Product</th>
                            <th className="py-2 px-2 text-center">Qty</th>
                            <th className="py-2 px-2 text-right">MRP</th>
                            <th className="py-2 px-2 text-right">Disc.</th>
                            <th className="py-2 px-2 text-right rounded-r-sm">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, idx) => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 text-gray-500">
                                    {(idx + 1).toString().padStart(2, "0")}
                                </td>
                                <td className="py-2 px-2">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-[9px] text-gray-500 bg-gray-100 inline-block px-1 py-0.5 rounded border border-gray-200 mt-0.5">
                                        {item.variant}
                                    </div>
                                </td>
                                <td className="py-2 px-2 text-center">{item.quantity}</td>
                                <td className="py-2 px-2 text-right">{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 text-right">{item.discount.toFixed(2)}</td>
                                <td className="py-2 px-2 text-right font-medium">
                                    {item.lineTotal.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── SUMMARY ────────────────────────────────────────────── */}
                <div className="flex justify-between bg-gray-50 p-4 rounded text-xs border border-gray-100">
                    <div className="grid grid-cols-[140px_1fr] gap-y-1.5 text-gray-600">
                        <span className="font-semibold">Total Quantity</span>
                        <span>: {totalQuantity} PCS</span>
                        <span className="font-semibold">Payment Method</span>
                        <span>: {order.pm.toUpperCase()}</span>
                        <span className="font-semibold">Shipping Charge (+)</span>
                        <span>: ৳ 70.00</span>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] gap-y-1.5 text-right">
                        <span className="font-semibold text-gray-600">Total MRP :</span>
                        <span className="font-bold text-gray-900">৳ {order.billAmount.toFixed(2)}</span>
                        <span className="font-semibold text-gray-600">Total Discount (-) :</span>
                        <span className="text-gray-900">৳ {totalDiscount.toFixed(2)}</span>
                        <span className="font-semibold text-gray-600">Total Balance (=) :</span>
                        <span className="font-bold text-emerald-600">৳ {order.grandTotal.toFixed(2)}</span>
                        <span className="font-semibold text-gray-600 mt-1">Paid :</span>
                        <span className="text-gray-900 mt-1">৳ {order.payableAmount.toFixed(2)}</span>
                        <span className="font-semibold text-gray-600">Due :</span>
                        <span className="text-red-600 font-bold">৳ {order.dueAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* ── POLICY FOOTER ──────────────────────────────────────── */}
                <div className="mt-10 text-[9px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                    <p>
                        <strong className="text-gray-700">Shipping Policy:</strong> Any increase in
                        shipping costs due to order weight increasing by 1 kg or more must be fully
                        covered by the customer.
                    </p>
                    <p className="mt-1">
                        <strong className="text-gray-700">Payment Policy:</strong> Orders with an
                        advance payment will be shipped via Cash on Delivery (COD), and the customer
                        must pay the remaining balance upon receiving the product.
                    </p>
                </div>
            </div>
        </div>
    );
}
