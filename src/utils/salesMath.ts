import { Sale, SalePayment, SalePaymentStatus, SaleReturn, SaleReturnTotals, SaleTotals } from "@/types/sales";

// Whole-paisa maths for Sales and Sale Returns (no float drift).
const toPaisa = (taka: number): number => (Number.isFinite(taka) ? Math.round(taka * 100) : 0);
const toTaka = (paisa: number): number => paisa / 100;
const nonNegative = (paisa: number): number => Math.max(0, paisa);

/**
 * Add Sale's existing rule: subtotal = Σ sale prices; discount = Σ (MRP − sale price), shown only;
 * tax = subtotal × tax %; total = subtotal + tax + shipping + additional charge.
 */
export function computeSaleTotals(sale: Pick<Sale, "items" | "orderTaxPct" | "shippingCost" | "additionalChargeAmount"> & { payments: SalePayment[] }): SaleTotals {
    const subTotal = sale.items.reduce((sum, item) => sum + nonNegative(toPaisa(item.salePrice)), 0);
    const totalDiscount = sale.items.reduce((sum, item) => sum + nonNegative(toPaisa(item.mrp) - toPaisa(item.salePrice)), 0);
    const tax = Math.round((subTotal * Math.max(0, sale.orderTaxPct)) / 100);
    const shipping = nonNegative(toPaisa(sale.shippingCost));
    const additionalCharge = nonNegative(toPaisa(sale.additionalChargeAmount));
    const grandTotal = subTotal + tax + shipping + additionalCharge;
    const received = sale.payments.reduce((sum, payment) => sum + nonNegative(toPaisa(payment.amount)), 0);
    return {
        subTotal: toTaka(subTotal),
        totalDiscount: toTaka(totalDiscount),
        tax: toTaka(tax),
        shipping: toTaka(shipping),
        additionalCharge: toTaka(additionalCharge),
        grandTotal: toTaka(grandTotal),
        received: toTaka(received),
        due: toTaka(Math.max(0, grandTotal - received)),
    };
}

/** Paid / Partially paid / Due from the payments, never set by hand. */
export function salePaymentStatus(totals: SaleTotals): SalePaymentStatus {
    if (totals.due <= 0) return "Paid";
    return totals.received > 0 ? "Partially_paid" : "Due";
}

/** Add Sale Return's existing rule: (Σ refunds − discount) + tax % of that + shipping. */
export function computeSaleReturnTotals(record: Pick<SaleReturn, "items" | "discount" | "orderTaxPct" | "shippingCost">): SaleReturnTotals {
    const subTotal = record.items.reduce((sum, item) => sum + nonNegative(toPaisa(item.refundAmount)), 0);
    const discount = Math.min(subTotal, nonNegative(toPaisa(record.discount)));
    const taxable = subTotal - discount;
    const tax = Math.round((taxable * Math.max(0, record.orderTaxPct)) / 100);
    const shipping = nonNegative(toPaisa(record.shippingCost));
    return {
        subTotal: toTaka(subTotal),
        discount: toTaka(discount),
        tax: toTaka(tax),
        shipping: toTaka(shipping),
        total: toTaka(taxable + tax + shipping),
    };
}
