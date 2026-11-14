import { Barcode, BarcodeStatus } from "@/types/barcodes";
import { PurchaseLineItem, PurchaseUnitLookup, PurchaseUnitMode, PurchaseUnitOption, UnitEligibilityContext } from "@/types/purchases";
import { serialKey } from "@/utils/purchaseMath";

// Which Barcodes-module units the purchase / return Product Search may add, and why one is refused.

const PURCHASABLE: readonly BarcodeStatus[] = ["Generated", "Printed"];
const RETURNABLE: readonly BarcodeStatus[] = ["Received", "Transferred"];

const sameSupplier = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Price paid when the unit was received (latest Received event); 0 when unknown. */
function receivedPrice(barcode: Barcode): number {
    for (let i = barcode.lifecycleEvents.length - 1; i >= 0; i--) {
        const event = barcode.lifecycleEvents[i];
        if (event.type === "Received") {
            return event.price ?? 0;
        }
    }
    return 0;
}

export function toUnitOption(barcode: Barcode, mode: PurchaseUnitMode): PurchaseUnitOption {
    return {
        barcodeId: barcode.id,
        serial: barcode.serialNumber,
        productName: barcode.productName,
        variant: barcode.variant,
        sku: barcode.sku,
        status: barcode.status,
        supplier: barcode.supplier?.name ?? null,
        unitPrice: mode === "return" ? receivedPrice(barcode) : 0,
    };
}

/** null when the unit may be added; otherwise the reason shown to the admin. */
export function unitRefusalReason(barcode: Barcode, context: UnitEligibilityContext): string | null {
    const serial = barcode.serialNumber;
    const key = serialKey(serial);

    if (context.inList.has(key)) {
        return `Cannot add: Barcode ${serial} is already in this list.`;
    }
    const takenBy = context.taken.get(key);
    if (takenBy) {
        return context.mode === "purchase"
            ? `Cannot add: Barcode ${serial} was already purchased on ${takenBy}.`
            : `Cannot add: Barcode ${serial} was already returned on ${takenBy}.`;
    }

    if (context.mode === "purchase") {
        if (PURCHASABLE.includes(barcode.status)) {
            return null;
        }
        return barcode.status === "Sold"
            ? `Cannot add: Barcode ${serial} is already marked as Sold.`
            : `Cannot add: Barcode ${serial} is already ${barcode.status === "Received" ? "received" : "in stock (Transferred)"}.`;
    }

    if (!RETURNABLE.includes(barcode.status)) {
        return barcode.status === "Sold"
            ? `Cannot add: Barcode ${serial} is already marked as Sold.`
            : `Cannot add: Barcode ${serial} has not been received yet (${barcode.status}).`;
    }
    const unitSupplier = barcode.supplier?.name ?? null;
    if (context.supplier && (!unitSupplier || !sameSupplier(unitSupplier, context.supplier))) {
        return `Cannot add: Barcode ${serial} was bought from ${unitSupplier ?? "an unknown supplier"}, not ${context.supplier}.`;
    }
    return null;
}

/** Exact serial lookup (a scan, or a typed serial + Enter). */
export function lookupUnitBySerial(barcodes: Barcode[], serial: string, context: UnitEligibilityContext): PurchaseUnitLookup {
    const key = serialKey(serial);
    const barcode = barcodes.find((item) => serialKey(item.serialNumber) === key);
    if (!barcode) {
        return { ok: false, message: `No barcode found with Serial/IMEI ${serial.trim()}.` };
    }
    const reason = unitRefusalReason(barcode, context);
    if (reason) {
        return { ok: false, message: reason };
    }
    return { ok: true, option: toUnitOption(barcode, context.mode) };
}

/** Serial key -> invoice number, for every line of the given records except `excludeId`. */
export function serialOwners(records: { id: string; invoiceNumber: string; items: { serial: string }[] }[], excludeId: string | null): Map<string, string> {
    const owners = new Map<string, string>();
    records.forEach((record) => {
        if (record.id === excludeId) {
            return;
        }
        record.items.forEach((item) => owners.set(serialKey(item.serial), record.invoiceNumber));
    });
    return owners;
}

/** Next number in a "PP-001603" style series. */
export function nextInvoiceNumber(prefix: "PP" | "PR", existing: string[]): string {
    const highest = existing.reduce((max, invoice) => {
        const match = invoice.match(/(\d+)$/);
        return match && invoice.startsWith(`${prefix}-`) ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${String(highest + 1).padStart(6, "0")}`;
}

/** A scanned / picked unit as an invoice row (one unit, quantity 1). */
export function unitToLineItem(option: PurchaseUnitOption): PurchaseLineItem {
    return {
        id: `line-${option.barcodeId}-${Date.now()}`,
        barcodeId: option.barcodeId,
        productName: option.productName,
        variant: option.variant,
        sku: option.sku,
        serial: option.serial,
        unitPrice: option.unitPrice,
        quantity: 1,
    };
}
