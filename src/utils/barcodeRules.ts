import { format, isValid, parseISO } from "date-fns";
import {
    Barcode,
    BarcodeDateRange,
    BarcodeEditableField,
    BarcodeEvent,
    BarcodeEventType,
    BarcodeHistoryRow,
    BarcodeJourneyEntry,
    BarcodeStatus,
} from "@/types/barcodes";
import {
    BARCODE_AUTO_SERIAL_DIGITS,
    BARCODE_PRE_RECEIPT_STATUSES,
    BARCODE_TRANSITIONS,
} from "@/constants/barcodes";

// Pure barcode business rules. No store, no React: safe to reuse on the backend.

// ── Lifecycle ───────────────────────────────────────────────────────────────
export function canTransition(status: BarcodeStatus, next: BarcodeEventType): boolean {
    return BARCODE_TRANSITIONS[status].includes(next);
}

/** Generated or Printed: not received into stock yet. */
export function isPreReceipt(status: BarcodeStatus): boolean {
    return BARCODE_PRE_RECEIPT_STATUSES.some((item) => item === status);
}

/** Why an event cannot be applied, or null when it can. */
export function getTransitionError(barcode: Barcode, next: BarcodeEventType): string | null {
    if (canTransition(barcode.status, next)) {
        return null;
    }
    if (next === "Printed") {
        return getPrintError(barcode);
    }
    if (barcode.status === "Sold") {
        return `Barcode ${barcode.serialNumber} is already Sold.`;
    }
    return `Cannot mark ${barcode.serialNumber} as ${next}: it is already ${barcode.status}.`;
}

/** Print-queue check, e.g. "Cannot print: Barcode already marked as Sold". */
export function getPrintError(barcode: Barcode): string | null {
    return canTransition(barcode.status, "Printed")
        ? null
        : `Cannot print: Barcode already marked as ${barcode.status}.`;
}

export function getDeleteError(barcode: Barcode): string | null {
    return isPreReceipt(barcode.status)
        ? null
        : `Cannot delete ${barcode.serialNumber}: it is already ${barcode.status}.`;
}

export function canEditBarcode(barcode: Barcode): boolean {
    return barcode.status !== "Sold";
}

/** Location is only edited before receipt; after that it changes through a Transfer. */
export function getEditError(barcode: Barcode, field: BarcodeEditableField): string | null {
    // Sold is final: a completed record is locked.
    if (barcode.status === "Sold") {
        return `Barcode ${barcode.serialNumber} is Sold and can no longer be edited.`;
    }
    if (field === "currentLocation" && !isPreReceipt(barcode.status)) {
        return `Location of ${barcode.serialNumber} changes through a transfer once it is ${barcode.status}.`;
    }
    return null;
}

/**
 * The only way a barcode's status / location / parties change: append an event
 * and derive the rest from it. Callers check `getTransitionError` first.
 */
export function applyEvent(barcode: Barcode, event: BarcodeEvent): Barcode {
    return {
        ...barcode,
        status: event.type,
        currentLocation: event.location,
        supplier: event.type === "Received" ? event.supplier : barcode.supplier,
        customer: event.type === "Sold" ? event.customer : barcode.customer,
        lifecycleEvents: [...barcode.lifecycleEvents, event],
    };
}

// ── Serials ─────────────────────────────────────────────────────────────────
export function normalizeSerial(value: string): string {
    return value.trim().toUpperCase();
}

/** Prefix of an auto serial: "SKU-YYYYMMDD-". */
export function autoSerialPrefix(sku: string, date: Date): string {
    return `${normalizeSerial(sku)}-${format(date, "yyyyMMdd")}-`;
}

/**
 * Next `count` auto serials for the prefix, continuing after the highest
 * sequence already taken (existing barcodes plus serials reserved in this batch).
 */
export function nextAutoSerials(prefix: string, count: number, taken: ReadonlySet<string>): string[] {
    let highest = 0;
    taken.forEach((serial) => {
        if (!serial.startsWith(prefix)) {
            return;
        }
        const sequence = Number.parseInt(serial.slice(prefix.length), 10);
        if (!Number.isNaN(sequence) && sequence > highest) {
            highest = sequence;
        }
    });
    return Array.from({ length: count }, (_, index) => (
        `${prefix}${String(highest + index + 1).padStart(BARCODE_AUTO_SERIAL_DIGITS, "0")}`
    ));
}

// ── Dates ───────────────────────────────────────────────────────────────────
/** Chronological order of two ISO timestamps, whatever their UTC offset. */
export function compareTimestamps(a: string, b: string): number {
    return Date.parse(a) - Date.parse(b);
}

/** ISO timestamp -> local calendar day as YYYY-MM-DD; null when invalid. */
export function toDayKey(timestamp: string): string | null {
    const date = parseISO(timestamp);
    return isValid(date) ? format(date, "yyyy-MM-dd") : null;
}

/** Inclusive on both ends; an open end matches everything on that side. */
export function isWithinDayRange(timestamp: string, range: BarcodeDateRange): boolean {
    if (!range.from && !range.to) {
        return true;
    }
    const day = toDayKey(timestamp);
    if (!day) {
        return false;
    }
    if (range.from && day < range.from) {
        return false;
    }
    return !(range.to && day > range.to);
}

/** Accepts only a real YYYY-MM-DD date (used when reading `?from=` / `?to=`). */
export function parseDayKey(value: string | null): string | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }
    return isValid(parseISO(value)) ? value : null;
}

// ── Derived views ───────────────────────────────────────────────────────────
/** One History row per lifecycle event, newest first. */
export function buildHistoryRows(barcodes: Barcode[]): BarcodeHistoryRow[] {
    const rows: BarcodeHistoryRow[] = [];
    barcodes.forEach((barcode) => {
        barcode.lifecycleEvents.forEach((event) => {
            rows.push({
                id: `${barcode.id}:${event.id}`,
                barcodeId: barcode.id,
                serialNumber: barcode.serialNumber,
                productName: barcode.productName,
                variant: barcode.variant,
                image: barcode.image,
                mrp: barcode.mrp,
                eventType: event.type,
                timestamp: event.timestamp,
                createdBy: event.createdBy,
                location: event.location,
                fromLocation: event.type === "Transferred" ? event.fromLocation : null,
                supplier: event.type === "Received" ? event.supplier.name : null,
                customer: event.type === "Sold" ? event.customer.name : null,
                price: event.type === "Received" || event.type === "Sold" ? event.price : null,
                reference: event.reference,
                event,
            });
        });
    });
    return rows.sort((a, b) => compareTimestamps(b.timestamp, a.timestamp));
}

/** Lifecycle events and field edits on one timeline, oldest first. */
export function buildJourney(barcode: Barcode): BarcodeJourneyEntry[] {
    const entries: BarcodeJourneyEntry[] = [
        ...barcode.lifecycleEvents.map((event): BarcodeJourneyEntry => ({
            kind: "event",
            id: event.id,
            timestamp: event.timestamp,
            event,
        })),
        ...barcode.auditLog.map((change): BarcodeJourneyEntry => ({
            kind: "change",
            id: change.id,
            timestamp: change.timestamp,
            change,
        })),
    ];
    return entries.sort((a, b) => compareTimestamps(a.timestamp, b.timestamp));
}

/** Display text stored in the audit log for an edited value. */
export function formatFieldValue(value: Barcode[BarcodeEditableField]): string | null {
    return value === null ? null : String(value);
}

// ── Display ─────────────────────────────────────────────────────────────────
/** "4/10/2026, 3:32:19 PM", the format the barcode tables already show. */
export function formatBarcodeDateTime(timestamp: string): string {
    const date = parseISO(timestamp);
    return isValid(date) ? format(date, "d/M/yyyy, h:mm:ss a") : "—";
}

/** "৳ 2,900.00"; null shows "—". */
export function formatBarcodeMoney(value: number | null): string {
    return value === null ? "—" : `৳ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}
