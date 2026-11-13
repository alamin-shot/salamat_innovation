import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    Barcode,
    BarcodeActionResult,
    BarcodeEditableField,
    BarcodeEditInput,
    BarcodeEvent,
    BarcodeEventType,
    BarcodeFieldChange,
    BarcodeLocation,
    BarcodeRejection,
    BarcodesState,
} from "@/types/barcodes";
import { BARCODES_STORAGE_KEY } from "@/constants/barcodes";
import { INITIAL_BARCODES } from "@/mocks/barcodes.mock";
import {
    applyEvent,
    autoSerialPrefix,
    formatFieldValue,
    getDeleteError,
    getEditError,
    getTransitionError,
    nextAutoSerials,
    normalizeSerial,
} from "@/utils/barcodeRules";

// LAYER 2: Optimistic cache for the Barcodes section.
// Status, location, supplier and customer only ever change by appending a
// lifecycle event; field edits are written to the audit log.

// A counter keeps ids unique when a batch creates many records in the same millisecond.
let idSequence = 0;
const newId = (prefix: string): string => `${prefix}-${Date.now()}-${++idSequence}`;
const nowIso = (): string => new Date().toISOString();

/** Shared fields of an event stamped now by `actor`. */
const eventBase = (actor: string, location: BarcodeLocation, reference: string | null, note = "") => ({
    id: newId("ev"),
    timestamp: nowIso(),
    createdBy: actor,
    location,
    reference,
    note,
});

const EDITABLE_FIELDS: BarcodeEditableField[] = ["mrp", "currentLocation"];

export const useGlobalBarcodesStore = create<BarcodesState>()(
    persist(
        (set, get) => {
            /**
             * Single write path for lifecycle events: validates the move for each
             * id, then appends the event built for that barcode.
             */
            const appendEvents = (
                ids: string[],
                type: BarcodeEventType,
                build: (barcode: Barcode) => BarcodeEvent,
            ): BarcodeActionResult => {
                const applied: string[] = [];
                const rejected: BarcodeRejection[] = [];
                const byId = new Map(get().barcodes.map((barcode) => [barcode.id, barcode]));

                ids.forEach((id) => {
                    const barcode = byId.get(id);
                    if (!barcode) {
                        rejected.push({ target: id, reason: "Barcode not found." });
                        return;
                    }
                    const error = getTransitionError(barcode, type);
                    if (error) {
                        rejected.push({ target: barcode.serialNumber, reason: error });
                        return;
                    }
                    byId.set(id, applyEvent(barcode, build(barcode)));
                    applied.push(id);
                });

                if (applied.length > 0) {
                    set((state) => ({ barcodes: state.barcodes.map((barcode) => byId.get(barcode.id) ?? barcode) }));
                }
                return { applied, rejected };
            };

            return {
                barcodes: INITIAL_BARCODES,

                // ── Generate ────────────────────────────────────────────────
                generateBarcodes: (items, location, actor) => {
                    const applied: string[] = [];
                    const rejected: BarcodeRejection[] = [];
                    const taken = new Set(get().barcodes.map((barcode) => normalizeSerial(barcode.serialNumber)));
                    const created: Barcode[] = [];
                    const now = new Date();

                    items.forEach((item) => {
                        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                            rejected.push({ target: item.productName, reason: "Quantity must be at least 1." });
                            return;
                        }

                        let serials: string[];
                        if (item.serialMode === "manual") {
                            serials = item.manualSerials.map(normalizeSerial);
                            if (serials.length !== item.quantity || serials.some((serial) => serial === "")) {
                                rejected.push({ target: item.productName, reason: `Enter ${item.quantity} serial number(s).` });
                                return;
                            }
                            const duplicate = serials.find((serial, index) => taken.has(serial) || serials.indexOf(serial) !== index);
                            if (duplicate) {
                                rejected.push({ target: duplicate, reason: `Serial ${duplicate} already exists.` });
                                return;
                            }
                        } else {
                            if (item.sku.trim() === "") {
                                rejected.push({ target: item.productName, reason: "A SKU is required to auto-generate serials." });
                                return;
                            }
                            serials = nextAutoSerials(autoSerialPrefix(item.sku, now), item.quantity, taken);
                        }

                        serials.forEach((serialNumber) => {
                            taken.add(serialNumber);
                            const generated: BarcodeEvent = { ...eventBase(actor, location, null), type: "Generated" };
                            const barcode: Barcode = {
                                id: newId("bc"),
                                serialNumber,
                                productId: item.productId,
                                productName: item.productName,
                                variant: item.variant,
                                sku: item.sku,
                                image: item.image,
                                mrp: item.mrp,
                                status: "Generated",
                                currentLocation: location,
                                supplier: null,
                                customer: null,
                                createdAt: generated.timestamp,
                                createdBy: actor,
                                updatedAt: null,
                                updatedBy: null,
                                lifecycleEvents: [generated],
                                auditLog: [],
                            };
                            created.push(barcode);
                            applied.push(barcode.id);
                        });
                    });

                    if (created.length > 0) {
                        set((state) => ({ barcodes: [...created, ...state.barcodes] }));
                    }
                    return { applied, rejected };
                },

                // ── Lifecycle events ────────────────────────────────────────
                markPrinted: (ids, actor) => appendEvents(ids, "Printed", (barcode) => ({
                    ...eventBase(actor, barcode.currentLocation, null),
                    type: "Printed",
                })),

                recordReceived: (id, input, actor) => appendEvents([id], "Received", () => ({
                    ...eventBase(actor, input.location, input.reference, input.note),
                    type: "Received",
                    supplier: input.supplier,
                    price: input.price,
                })),

                recordTransfer: (id, input, actor) => {
                    const barcode = get().barcodes.find((item) => item.id === id);
                    if (barcode && barcode.currentLocation === input.toLocation) {
                        return { applied: [], rejected: [{ target: barcode.serialNumber, reason: `Already at ${input.toLocation}.` }] };
                    }
                    return appendEvents([id], "Transferred", (current) => ({
                        ...eventBase(actor, input.toLocation, input.reference, input.note),
                        type: "Transferred",
                        fromLocation: current.currentLocation,
                        handedOverBy: input.handedOverBy,
                        receivedBy: input.receivedBy,
                    }));
                },

                recordSale: (id, input, actor) => appendEvents([id], "Sold", (barcode) => ({
                    ...eventBase(actor, barcode.currentLocation, input.reference, input.note),
                    type: "Sold",
                    customer: input.customer,
                    price: input.price,
                })),

                // ── Edit (field-level audit log) ────────────────────────────
                updateBarcode: (id, changes, actor) => {
                    const barcode = get().barcodes.find((item) => item.id === id);
                    if (!barcode) {
                        return { applied: [], rejected: [{ target: id, reason: "Barcode not found." }] };
                    }

                    const timestamp = nowIso();
                    const entries: BarcodeFieldChange[] = [];
                    const rejected: BarcodeRejection[] = [];
                    const accepted: BarcodeEditInput = {};

                    EDITABLE_FIELDS.forEach((field) => {
                        const value = changes[field];
                        if (value === undefined || value === barcode[field]) {
                            return;
                        }
                        const error = getEditError(barcode, field);
                        if (error) {
                            rejected.push({ target: barcode.serialNumber, reason: error });
                            return;
                        }
                        entries.push({
                            id: newId("chg"),
                            timestamp,
                            changedBy: actor,
                            field,
                            oldValue: formatFieldValue(barcode[field]),
                            newValue: formatFieldValue(value),
                        });
                        if (field === "mrp") {
                            accepted.mrp = changes.mrp;
                        } else {
                            accepted.currentLocation = changes.currentLocation;
                        }
                    });

                    if (entries.length === 0) {
                        return { applied: [], rejected };
                    }
                    const updated: Barcode = {
                        ...barcode,
                        ...accepted,
                        updatedAt: timestamp,
                        updatedBy: actor,
                        auditLog: [...barcode.auditLog, ...entries],
                    };
                    set((state) => ({ barcodes: state.barcodes.map((item) => (item.id === id ? updated : item)) }));
                    return { applied: [id], rejected };
                },

                // ── Delete ──────────────────────────────────────────────────
                deleteBarcodes: (ids) => {
                    const applied: string[] = [];
                    const rejected: BarcodeRejection[] = [];
                    get().barcodes.forEach((barcode) => {
                        if (!ids.includes(barcode.id)) {
                            return;
                        }
                        const error = getDeleteError(barcode);
                        if (error) {
                            rejected.push({ target: barcode.serialNumber, reason: error });
                        } else {
                            applied.push(barcode.id);
                        }
                    });
                    if (applied.length > 0) {
                        set((state) => ({ barcodes: state.barcodes.filter((barcode) => !applied.includes(barcode.id)) }));
                    }
                    return { applied, rejected };
                },
            };
        },
        { name: BARCODES_STORAGE_KEY },
    ),
);
