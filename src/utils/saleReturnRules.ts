import { Sale, SaleReturn, SaleReturnContext, SoldUnitLookup } from "@/types/sales";
import { toTimestamp } from "@/utils/dateRules";

const key = (serial: string) => serial.trim().toUpperCase();

/** The most recent sale that contains this serial (a unit can be resold after a return). */
export function findSaleForSerial(sales: Sale[], serial: string): Sale | null {
    const wanted = key(serial);
    return [...sales]
        .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
        .find((sale) => sale.items.some((item) => key(item.serial) === wanted)) ?? null;
}

/** The return that already holds this unit from this sale, if any. */
export function findExistingReturn(saleReturns: SaleReturn[], serial: string, saleId: string): SaleReturn | null {
    const wanted = key(serial);
    return saleReturns.find((record) => record.items.some((item) => key(item.serial) === wanted && item.saleId === saleId)) ?? null;
}

/**
 * Scan a sold serial into a Sale Return. The original sale decides the customer; once the first
 * unit locks the customer, a unit sold to anyone else is refused with the reason.
 */
export function lookupSoldUnit(sales: Sale[], saleReturns: SaleReturn[], rawSerial: string, context: SaleReturnContext): SoldUnitLookup {
    const serial = rawSerial.trim();
    if (!serial) return { ok: false, message: "Scan or type a serial number." };
    if (context.inList.some((existing) => key(existing) === key(serial))) {
        return { ok: false, message: `Cannot add item: Serial ${serial} is already in this return.` };
    }
    const sale = findSaleForSerial(sales, serial);
    if (!sale) return { ok: false, message: `Cannot add item: No sale found for serial ${serial}.` };

    const sold = sale.items.find((item) => key(item.serial) === key(serial));
    if (!sold) return { ok: false, message: `Cannot add item: No sale found for serial ${serial}.` };

    const existing = findExistingReturn(saleReturns, serial, sale.id);
    if (existing) return { ok: false, message: `Cannot add item: Serial ${serial} was already returned on ${existing.returnNumber}.` };

    if (context.lockedCustomerName !== null && (sale.customerId ?? sale.customerName) !== (context.lockedCustomerId ?? context.lockedCustomerName)) {
        return { ok: false, message: `Cannot add item: This serial was sold to a different customer (${sale.customerName}), not ${context.lockedCustomerName}.` };
    }

    return {
        ok: true,
        customerId: sale.customerId,
        customerName: sale.customerName,
        item: {
            saleId: sale.id,
            saleInvoice: sale.invoiceNumber,
            barcodeId: sold.barcodeId,
            productName: sold.productName,
            variant: sold.variant,
            sku: sold.sku,
            serial: sold.serial,
            unitPrice: sold.salePrice,
            refundAmount: sold.salePrice,
        },
    };
}

/** Units of one invoice that can still be returned (for "return by invoice"). */
export function returnableItems(sale: Sale, saleReturns: SaleReturn[]) {
    return sale.items.filter((item) => !findExistingReturn(saleReturns, item.serial, sale.id));
}

/** Exact invoice lookup ("PS-003268" or "INV-2026-1187"), case-insensitive. */
export function findSaleByInvoice(sales: Sale[], invoice: string): Sale | null {
    const wanted = invoice.trim().toUpperCase();
    return sales.find((sale) => sale.invoiceNumber.toUpperCase() === wanted) ?? null;
}
