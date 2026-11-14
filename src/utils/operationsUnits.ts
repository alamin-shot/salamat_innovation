import { Barcode } from "@/types/barcodes";
import { OperationSerial, OperationUnitLookup } from "@/types/operations";

/**
 * A serial scanned into a Stock Transfer or Damage record must be an in-stock unit of the Barcodes
 * module (Received or Transferred). Product, SKU and variant come from that unit, never typed by hand.
 */
export function lookupStockUnit(barcodes: Barcode[], rawSerial: string, inList: OperationSerial[]): OperationUnitLookup {
    const serial = rawSerial.trim();
    if (!serial) {
        return { ok: false, message: "Scan or type a serial number." };
    }
    const key = serial.toUpperCase();
    if (inList.some((item) => item.serialNo.trim().toUpperCase() === key)) {
        return { ok: false, message: `Serial ${serial} is already in this list.` };
    }
    const unit = barcodes.find((barcode) => barcode.serialNumber.trim().toUpperCase() === key);
    if (!unit) {
        return { ok: false, message: `No barcode found with serial ${serial}.` };
    }
    if (unit.status === "Sold") {
        return { ok: false, message: `Serial ${serial} is already marked as Sold.` };
    }
    if (unit.status === "Generated" || unit.status === "Printed") {
        return { ok: false, message: `Serial ${serial} has not been received into stock yet (${unit.status}).` };
    }
    return {
        ok: true,
        serial: { id: `unit-${unit.id}`, serialNo: unit.serialNumber, product: unit.productName, sku: unit.sku, variant: unit.variant },
    };
}
