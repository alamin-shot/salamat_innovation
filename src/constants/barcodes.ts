import {
    BarcodeEditableField,
    BarcodeEventType,
    BarcodeLocation,
    BarcodesDrawerMode,
    BarcodeStatus,
    BarcodesTabKey,
} from "@/types/barcodes";

/** Stamped as the actor until the live auth session is wired. */
export const BARCODES_AUDIT_ACTOR = "Admin";

export const BARCODES_STORAGE_KEY = "erp-barcodes-storage-v1";

export const BARCODES_PER_PAGE = 10;

export const BARCODE_EVENT_TYPES = [
    "Generated",
    "Printed",
    "Received",
    "Transferred",
    "Sold",
] as const satisfies readonly BarcodeEventType[];

/** Approved mock locations, until locations come from the backend. */
export const BARCODE_LOCATIONS = [
    "Warehouse A",
    "Warehouse B",
    "Jamuna Future Park",
    "Bashundhara City",
    "TEKZO Online Shop",
] as const satisfies readonly BarcodeLocation[];

/** Statuses that have not been received yet: printable, editable location, deletable. */
export const BARCODE_PRE_RECEIPT_STATUSES = ["Generated", "Printed"] as const satisfies readonly BarcodeStatus[];

/** Allowed next events from each status. Sold is final. */
export const BARCODE_TRANSITIONS: Readonly<Record<BarcodeStatus, readonly BarcodeEventType[]>> = {
    Generated: ["Printed", "Received"],
    Printed: ["Printed", "Received"],
    Received: ["Transferred", "Sold"],
    Transferred: ["Transferred", "Sold"],
    Sold: [],
};

export const BARCODE_FIELD_LABELS: Readonly<Record<BarcodeEditableField, string>> = {
    mrp: "MRP",
    currentLocation: "Location",
};

/** Every value the Barcodes pages write to `?drawer=`. */
export const BARCODES_DRAWER_MODES = [
    "none",
    "view-barcode",
    "edit-barcode",
] as const satisfies readonly BarcodesDrawerMode[];

/** Tabs that show the Edit and Delete actions (History is a read-only log). */
export const BARCODES_EDITABLE_TABS = ["list", "generated"] as const satisfies readonly BarcodesTabKey[];

/** Auto serial format: SKU-YYYYMMDD-0001. */
export const BARCODE_AUTO_SERIAL_DIGITS = 4;

/**
 * Semantic chip colours: inflow (Received) emerald, transfer amber, outflow (Sold)
 * rose; Generated / Printed are states, not actions, so they use palette colours.
 */
export const BARCODE_STATUS_STYLES: Readonly<Record<BarcodeStatus, string>> = {
    Generated: "bg-sky-50 text-sky-700 border-sky-100",
    Printed: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Received: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Transferred: "bg-amber-50 text-amber-700 border-amber-100",
    Sold: "bg-rose-50 text-rose-700 border-rose-100",
};

/** Timeline dot colours, matching the chips above. */
export const BARCODE_STATUS_DOTS: Readonly<Record<BarcodeStatus, string>> = {
    Generated: "bg-sky-500",
    Printed: "bg-indigo-500",
    Received: "bg-emerald-500",
    Transferred: "bg-amber-500",
    Sold: "bg-rose-500",
};
