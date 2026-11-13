import {
    Barcode,
    BarcodeCustomer,
    BarcodeEmployee,
    BarcodeEvent,
    BarcodeFieldChange,
    BarcodeGeneratedEvent,
    BarcodeLocation,
    BarcodeSupplier,
} from "@/types/barcodes";
import { applyEvent } from "@/utils/barcodeRules";

// One shared seed for Barcode List, Generate Barcode and Barcode History.
// Products, serials, suppliers and customers come from the old inline mocks of
// those pages; every journey is built through the same `applyEvent` the store uses.

// ── Parties ─────────────────────────────────────────────────────────────────
const supplier = (name: string, id: string | null = null): BarcodeSupplier => ({ id, name, role: "Supplier" });
const customer = (name: string, id: string | null = null): BarcodeCustomer => ({ id, name, role: "Customer" });
const employee = (name: string): BarcodeEmployee => ({ id: null, name, role: "Employee" });

const IMAGE_COLLECTION = supplier("Image Collection");
const CELL_TECH_BD = supplier("Cell Tech BD");
const TAHAM_TECH = supplier("Taham Tech");
const MR_TELECOM = supplier("MR Telecom", "8");

const SAZZAD = employee("Md Zihadul Islam Sazzad");
const RAFIQUL = employee("Rafiqul Islam");
const TANVIR = employee("Tanvir Ahmed");

// ── Event builders ──────────────────────────────────────────────────────────
interface EventMeta {
    id: string;
    at: string;
    by?: string;
    location: BarcodeLocation;
    reference?: string | null;
    note?: string;
}

const base = ({ id, at, by = "Admin", location, reference = null, note = "" }: EventMeta) => ({
    id,
    // Stored as UTC ISO, the same format the store stamps new events with.
    timestamp: new Date(at).toISOString(),
    createdBy: by,
    location,
    reference,
    note,
});

const generated = (meta: EventMeta): BarcodeGeneratedEvent => ({ ...base(meta), type: "Generated" });
const printed = (meta: EventMeta): BarcodeEvent => ({ ...base(meta), type: "Printed" });
const received = (meta: EventMeta, from: BarcodeSupplier, price: number | null): BarcodeEvent => ({
    ...base(meta),
    type: "Received",
    supplier: from,
    price,
});
const transferred = (
    meta: EventMeta,
    fromLocation: BarcodeLocation,
    handedOverBy: BarcodeEmployee,
    receivedBy: BarcodeEmployee | null,
): BarcodeEvent => ({ ...base(meta), type: "Transferred", fromLocation, handedOverBy, receivedBy });
const sold = (meta: EventMeta, to: BarcodeCustomer, price: number | null): BarcodeEvent => ({
    ...base(meta),
    type: "Sold",
    customer: to,
    price,
});

// ── Barcode builder ─────────────────────────────────────────────────────────
interface SeedIdentity {
    id: string;
    serialNumber: string;
    productId: string | null;
    productName: string;
    variant: string;
    sku: string;
    mrp: number | null;
}

/** Starts from the Generated event and folds the rest of the journey onto it. */
function seed(
    identity: SeedIdentity,
    first: BarcodeGeneratedEvent,
    rest: BarcodeEvent[] = [],
    auditLog: BarcodeFieldChange[] = [],
): Barcode {
    const start: Barcode = {
        ...identity,
        image: "/phone.png",
        status: "Generated",
        currentLocation: first.location,
        supplier: null,
        customer: null,
        createdAt: first.timestamp,
        createdBy: first.createdBy,
        updatedAt: null,
        updatedBy: null,
        lifecycleEvents: [first],
        auditLog,
    };
    const lastEdit = auditLog[auditLog.length - 1];
    const journey = rest.reduce(applyEvent, start);
    return lastEdit ? { ...journey, updatedAt: lastEdit.timestamp, updatedBy: lastEdit.changedBy } : journey;
}


// ── Seed ────────────────────────────────────────────────────────────────────
// Stored newest first, the order new barcodes are added in.
export const INITIAL_BARCODES: Barcode[] = [
    seed(
        { id: "bc-12", serialNumber: "XM14-256-BLK-20261110-0002", productId: "4", productName: "xiaomi 14", variant: "Black/12GB/256GB", sku: "XM14-256-BLK", mrp: 89999 },
        generated({ id: "ev-12-1", at: "2026-11-10T11:20:00+06:00", location: "Bashundhara City" }),
    ),
    seed(
        { id: "bc-11", serialNumber: "XM14-256-BLK-20261110-0001", productId: "4", productName: "xiaomi 14", variant: "Black/12GB/256GB", sku: "XM14-256-BLK", mrp: 89999 },
        generated({ id: "ev-11-1", at: "2026-11-10T11:20:00+06:00", location: "Bashundhara City" }),
        [printed({ id: "ev-11-2", at: "2026-11-10T11:24:00+06:00", location: "Bashundhara City" })],
    ),
    seed(
        { id: "bc-10", serialNumber: "MJGTJ02LF-20261108-0001", productId: null, productName: "XIAOMI MIJIA Handheld Garment Steamer 2", variant: "White", sku: "MJGTJ02LF", mrp: 2900 },
        generated({ id: "ev-10-1", at: "2026-11-08T16:05:00+06:00", location: "Jamuna Future Park" }),
        [printed({ id: "ev-10-2", at: "2026-11-08T16:07:00+06:00", location: "Jamuna Future Park" })],
    ),
    seed(
        { id: "bc-09", serialNumber: "S/N:V207510D43000NX", productId: null, productName: "VOLTME Revo 140W", variant: "Black", sku: "VOLTME-R140-BLK", mrp: 6500 },
        generated({ id: "ev-09-1", at: "2026-11-06T10:15:00+06:00", location: "Warehouse B" }),
    ),
    seed(
        { id: "bc-08", serialNumber: "S/N:V2&7510D43&00&A", productId: null, productName: "VOLTME Revo 140W", variant: "Black", sku: "VOLTME-R140-BLK", mrp: 6500 },
        generated({ id: "ev-08-1", at: "2026-11-06T10:15:00+06:00", location: "Warehouse B" }),
    ),
    seed(
        { id: "bc-07", serialNumber: "865066060847547", productId: null, productName: "Redmi Turbo 4 Pro", variant: "White/12GB/256GB", sku: "RT4P-256-WHT", mrp: 42000 },
        generated({ id: "ev-07-1", at: "2026-11-02T13:40:00+06:00", by: SAZZAD.name, location: "Warehouse A" }),
        [printed({ id: "ev-07-2", at: "2026-11-02T13:45:00+06:00", by: SAZZAD.name, location: "Warehouse A" })],
        [{ id: "chg-07-1", timestamp: "2026-11-03T09:10:00+06:00", changedBy: "Admin", field: "mrp", oldValue: "43000", newValue: "42000" }],
    ),
    seed(
        { id: "bc-06", serialNumber: "862345067812345", productId: "1", productName: "vivo S2", variant: "128GB", sku: "VIVO-S2-128", mrp: 32999 },
        generated({ id: "ev-06-1", at: "2026-10-20T10:00:00+06:00", location: "Warehouse A" }),
        [
            printed({ id: "ev-06-2", at: "2026-10-20T10:05:00+06:00", location: "Warehouse A" }),
            received({ id: "ev-06-3", at: "2026-10-21T15:30:00+06:00", location: "Warehouse A", reference: "PO-2026-0412" }, MR_TELECOM, 29500),
            transferred({ id: "ev-06-4", at: "2026-10-25T12:00:00+06:00", location: "Bashundhara City", reference: "ST-2026-0088" }, "Warehouse A", SAZZAD, RAFIQUL),
            transferred({ id: "ev-06-5", at: "2026-11-01T17:45:00+06:00", location: "TEKZO Online Shop", reference: "ST-2026-0103", note: "Moved for online order fulfilment" }, "Bashundhara City", RAFIQUL, TANVIR),
        ],
    ),
    seed(
        { id: "bc-05", serialNumber: "PMAC-20261012-0001", productId: "3", productName: "Portable Mini Air Cooler", variant: "White", sku: "PMAC", mrp: 3500 },
        generated({ id: "ev-05-1", at: "2026-10-12T11:00:00+06:00", location: "Warehouse A" }),
        [
            printed({ id: "ev-05-2", at: "2026-10-12T11:03:00+06:00", location: "Warehouse A" }),
            received({ id: "ev-05-3", at: "2026-10-13T14:20:00+06:00", location: "Warehouse A", reference: "PO-2026-0398" }, TAHAM_TECH, 2600),
            transferred({ id: "ev-05-4", at: "2026-10-18T10:30:00+06:00", location: "Warehouse B", reference: "ST-2026-0071" }, "Warehouse A", TANVIR, null),
        ],
    ),
    seed(
        { id: "bc-04", serialNumber: "353100552915705", productId: null, productName: "iPhone 13 Pro", variant: "128GB/Sierra Blue", sku: "IP13P-128-SB", mrp: 53990 },
        generated({ id: "ev-04-1", at: "2026-10-06T09:30:00+06:00", location: "TEKZO Online Shop" }),
        [
            printed({ id: "ev-04-2", at: "2026-10-06T09:32:00+06:00", location: "TEKZO Online Shop" }),
            received({ id: "ev-04-3", at: "2026-10-07T13:10:00+06:00", location: "TEKZO Online Shop", reference: "PO-2026-0377" }, IMAGE_COLLECTION, 51000),
            sold({ id: "ev-04-4", at: "2026-10-15T19:25:00+06:00", location: "TEKZO Online Shop", reference: "INV-2026-1187" }, customer("Yasin", "1"), 53990),
        ],
    ),
    seed(
        { id: "bc-03", serialNumber: "K403H7AN30068", productId: null, productName: "Kieslect Health Tracker", variant: "Black", sku: "KSL-HT-BLK", mrp: 5200 },
        generated({ id: "ev-03-1", at: "2026-10-04T17:30:00+06:00", location: "Warehouse A" }),
        [
            printed({ id: "ev-03-2", at: "2026-10-04T17:35:00+06:00", location: "Warehouse A" }),
            received({ id: "ev-03-3", at: "2026-10-04T17:48:22+06:00", location: "Warehouse A", reference: "PO-2026-0360" }, TAHAM_TECH, 4700),
        ],
    ),
    seed(
        { id: "bc-02", serialNumber: "865013000353040", productId: null, productName: "Redmi 15", variant: "Midnight Black/8GB/256GB", sku: "RDM15-256-MB", mrp: 25500 },
        generated({ id: "ev-02-1", at: "2026-10-04T14:20:00+06:00", location: "Warehouse A" }),
        [
            printed({ id: "ev-02-2", at: "2026-10-04T14:25:00+06:00", location: "Warehouse A" }),
            received({ id: "ev-02-3", at: "2026-10-04T14:38:13+06:00", location: "Warehouse A", reference: "PO-2026-0359" }, CELL_TECH_BD, 23500),
            transferred({ id: "ev-02-4", at: "2026-10-04T14:39:00+06:00", location: "Jamuna Future Park", reference: "ST-2026-0064" }, "Warehouse A", SAZZAD, RAFIQUL),
            sold({ id: "ev-02-5", at: "2026-10-04T14:40:13+06:00", location: "Jamuna Future Park", reference: "INV-2026-1121" }, customer("Mintu Talukder"), 25500),
        ],
    ),
    seed(
        { id: "bc-01", serialNumber: "357054044466206", productId: null, productName: "Nothing Phone 4a", variant: "White/8GB/128GB", sku: "NP4A-128-WHT", mrp: 48500 },
        generated({ id: "ev-01-1", at: "2026-10-04T15:00:00+06:00", location: "Warehouse A" }),
        [
            printed({ id: "ev-01-2", at: "2026-10-04T15:10:00+06:00", location: "Warehouse A" }),
            received({ id: "ev-01-3", at: "2026-10-04T15:32:19+06:00", location: "Warehouse A", reference: "PO-2026-0361" }, IMAGE_COLLECTION, 47400),
            sold({ id: "ev-01-4", at: "2026-10-04T15:45:19+06:00", location: "Warehouse A", reference: "INV-2026-1122" }, customer("Ratul Shikder"), 48500),
        ],
    ),
];
