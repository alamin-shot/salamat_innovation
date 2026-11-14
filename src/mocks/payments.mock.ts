import { PaymentRecord } from "@/types/payments";

const SAZZAD = "Md Zihadul Islam Sazzad";
const LEGACY_DAY = "2026-10-18T00:00:00+06:00";

type LegacyLog = Pick<PaymentRecord, "id" | "number" | "personId" | "contact" | "businessName" | "type" | "amount"> & { invoiceRef?: string };

/** The Payment List's original records (18 Oct 2026). Method was not recorded. */
const LEGACY_LOGS: LegacyLog[] = [
    // Settles purchase PP-001601 (৳13,000), so that invoice gets no second record.
    { id: "1", number: "PP-3594", personId: "17", contact: "Gadget Opia", businessName: "Gadget Opia", type: "payment sent", amount: 13000, invoiceRef: "PP-001601" },
    { id: "2", number: "SLT-3593", personId: null, contact: "Zihad Ahmed Mahin", businessName: "-", type: "payment received", amount: 28500 },
    { id: "3", number: "PP-3592", personId: null, contact: "Minal Hossain", businessName: "-", type: "payment sent", amount: 33300 },
    { id: "4", number: "PP-3591", personId: "17", contact: "Gadget Opia", businessName: "Gadget Opia", type: "payment sent", amount: 35300 },
    { id: "5", number: "PP-3590", personId: "21", contact: "Xeero", businessName: "Sojib", type: "payment sent", amount: 10000 },
    { id: "6", number: "PMT-3589", personId: null, contact: "Live Apple", businessName: "-", type: "payment received", amount: 15000 },
    { id: "7", number: "PP-3587", personId: "18", contact: "huge Collection", businessName: "huge Collection", type: "payment sent", amount: 50000 },
    { id: "8", number: "SLT-3586", personId: null, contact: "Ashraful Amin", businessName: "-", type: "payment received", amount: 41000 },
];

const legacy = (log: LegacyLog): PaymentRecord => ({
    ...log,
    contactPhone: null,
    date: LEGACY_DAY,
    method: "-",
    invoiceRef: log.invoiceRef ?? null,
    source: "manual",
    note: "-",
    createdAt: LEGACY_DAY,
    createdBy: SAZZAD,
});

type InvoiceSeed = Pick<PaymentRecord, "id" | "number" | "personId" | "contact" | "contactPhone" | "businessName" | "date" | "type" | "amount" | "method" | "invoiceRef" | "source">;

/**
 * Payments that used to live inside the invoices themselves (sale payment rows, purchases marked
 * "Paid", the storefront order's paid part), now posted as their own records.
 */
const INVOICE_PAYMENTS: InvoiceSeed[] = [
    { id: "pay-3595", number: "PAY-3595", personId: "26", contact: "Mainul Hasan Mahin", contactPhone: null, businessName: "—", date: "2026-10-12T12:40:00+06:00", type: "payment received", amount: 75000, method: "Cash", invoiceRef: "PS-003267", source: "sale" },
    { id: "pay-3596", number: "PAY-3596", personId: "27", contact: "SUFINEWAJ RAYHAN", contactPhone: null, businessName: "—", date: "2026-10-10T17:05:00+06:00", type: "payment received", amount: 1000, method: "SSLCommerz", invoiceRef: "PS-003260", source: "sale" },
    { id: "pay-3597", number: "PAY-3597", personId: "1", contact: "Yasin", contactPhone: null, businessName: "—", date: "2026-10-15T19:25:00+06:00", type: "payment received", amount: 53990, method: "Cash", invoiceRef: "INV-2026-1187", source: "sale" },
    { id: "pay-3598", number: "PAY-3598", personId: "29", contact: "Ratul Shikder", contactPhone: null, businessName: "—", date: "2026-10-04T15:45:19+06:00", type: "payment received", amount: 48500, method: "Cash", invoiceRef: "INV-2026-1122", source: "sale" },
    { id: "pay-3599", number: "PAY-3599", personId: "28", contact: "Mintu Talukder", contactPhone: null, businessName: "—", date: "2026-10-04T14:40:13+06:00", type: "payment received", amount: 25500, method: "Cash", invoiceRef: "INV-2026-1121", source: "sale" },
    { id: "pay-3600", number: "PAY-3600", personId: "15", contact: "Rasel Raj", contactPhone: null, businessName: "Rasel Raj", date: "2026-10-11T00:00:00+06:00", type: "payment sent", amount: 82000, method: "-", invoiceRef: "PP-001603", source: "purchase" },
    { id: "pay-3601", number: "PAY-3601", personId: "16", contact: "Bina Ambix", contactPhone: null, businessName: "Bina Ambix", date: "2026-10-10T00:00:00+06:00", type: "payment sent", amount: 60000, method: "-", invoiceRef: "PP-001602", source: "purchase" },
    { id: "pay-3602", number: "PAY-3602", personId: "18", contact: "huge Collection", contactPhone: null, businessName: "huge Collection", date: "2026-10-09T00:00:00+06:00", type: "payment sent", amount: 47400, method: "-", invoiceRef: "PP-001599", source: "purchase" },
    { id: "pay-3603", number: "PAY-3603", personId: "19", contact: "Cell Tech BD", contactPhone: null, businessName: "Cell Tech BD", date: "2026-10-09T00:00:00+06:00", type: "payment sent", amount: 23000, method: "-", invoiceRef: "PP-001598", source: "purchase" },
    { id: "pay-3604", number: "PAY-3604", personId: null, contact: "MD TAMIM IQBAL REZA", contactPhone: "01815413494", businessName: "-", date: "2026-10-26T21:30:00+06:00", type: "payment received", amount: 790, method: "-", invoiceRef: "ORD-20261025-001798", source: "order" },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
    ...LEGACY_LOGS.map(legacy),
    ...INVOICE_PAYMENTS.map((seed) => ({ ...seed, note: "-", createdAt: seed.date, createdBy: SAZZAD })),
];
