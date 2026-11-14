import { Barcode } from "@/types/barcodes";
import { SaleLineItem, SellableUnitLookup } from "@/types/sales";

const key = (serial: string) => serial.trim().toUpperCase();

/** Purchase price from the unit's latest Received event; 0 when unknown. */
function purchasePriceOf(barcode: Barcode): number {
    for (let i = barcode.lifecycleEvents.length - 1; i >= 0; i--) {
        const event = barcode.lifecycleEvents[i];
        if (event.type === "Received") return event.price ?? 0;
    }
    return 0;
}

/**
 * Add Sale: a scanned serial must be an in-stock unit (Received / Transferred). Product, prices and SKU
 * come from Barcodes; the sale price starts at the MRP and can be lowered on the row.
 */
export function lookupSellableUnit(barcodes: Barcode[], rawSerial: string, inList: SaleLineItem[]): SellableUnitLookup {
    const serial = rawSerial.trim();
    if (!serial) return { ok: false, message: "Scan or type a serial number." };
    if (inList.some((item) => key(item.serial) === key(serial))) return { ok: false, message: `Cannot add: Serial ${serial} is already in this sale.` };

    const unit = barcodes.find((barcode) => key(barcode.serialNumber) === key(serial));
    if (!unit) return { ok: false, message: `Cannot add: No barcode found with serial ${serial}.` };
    if (unit.status === "Sold") return { ok: false, message: `Cannot add: Serial ${serial} is already marked as Sold.` };
    if (unit.status === "Generated" || unit.status === "Printed") return { ok: false, message: `Cannot add: Serial ${serial} has not been received into stock yet (${unit.status}).` };

    const mrp = unit.mrp ?? 0;
    return {
        ok: true,
        item: {
            id: `line-${unit.id}`,
            barcodeId: unit.id,
            productName: unit.productName,
            variant: unit.variant,
            sku: unit.sku,
            serial: unit.serialNumber,
            purchasePrice: purchasePriceOf(unit),
            mrp,
            salePrice: mrp,
            quantity: 1,
        },
    };
}
