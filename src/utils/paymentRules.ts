import { InvoicePaymentLine, PaymentListFilters, PaymentListRow, PaymentRecord } from "@/types/payments";
import { PAYMENT_NUMBER_PREFIX } from "@/constants/payments";
import { toTimestamp } from "@/utils/dateRules";

// Pure payment rules shared by the payments store, the invoice screens and the ledger.

const toPaisa = (taka: number): number => (Number.isFinite(taka) ? Math.round(taka * 100) : 0);

/** "PAY-3595": continues after the highest number used by any payment so far. */
export function nextPaymentNumber(existing: string[]): string {
    const highest = existing.reduce((max, value) => {
        const match = value.match(/-(\d+)$/);
        return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${PAYMENT_NUMBER_PREFIX}-${highest + 1}`;
}

/** Records posted against one invoice, oldest first. */
export const paymentsForInvoice = (records: PaymentRecord[], invoiceRef: string): PaymentRecord[] =>
    records.filter((record) => record.invoiceRef === invoiceRef).sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));

/** An invoice's payments as the editable lines Add / Edit Sale show. */
export const invoicePaymentLines = (records: PaymentRecord[], invoiceRef: string): InvoicePaymentLine[] =>
    paymentsForInvoice(records, invoiceRef).map((record) => ({ id: record.id, method: record.method, amount: record.amount }));

/** Net amount settled on an invoice in the given direction (received for sales / orders, sent for purchases). */
export function paidOnInvoice(records: PaymentRecord[], invoiceRef: string, direction: PaymentRecord["type"]): number {
    const paisa = paymentsForInvoice(records, invoiceRef)
        .reduce((sum, record) => sum + (record.type === direction ? toPaisa(record.amount) : -toPaisa(record.amount)), 0);
    return paisa / 100;
}

/** Legacy Payment List columns: money sent is a debit, money received a credit. */
export const toPaymentListRow = (record: PaymentRecord): PaymentListRow => ({
    ...record,
    debit: record.type === "payment sent" ? record.amount : 0,
    credit: record.type === "payment received" ? record.amount : 0,
});

/** Filter value for a record's party: the People id, or the contact name when unlinked. */
export const paymentPartyKey = (record: Pick<PaymentRecord, "personId" | "contact">): string =>
    record.personId ?? `name:${record.contact.trim().toLowerCase()}`;

const dayOf = (iso: string): string => {
    const time = toTimestamp(iso);
    if (!time) return "";
    // Calendar day in Dhaka time (UTC+6), matching how dates are entered.
    return new Date(time + 6 * 60 * 60 * 1000).toISOString().slice(0, 10);
};

/** Applies the Payment List filter menu. */
export function matchesPaymentFilters(record: PaymentRecord, filters: PaymentListFilters): boolean {
    if (filters.type && record.type !== filters.type) return false;
    const day = dayOf(record.date);
    if (filters.date.from && (!day || day < filters.date.from)) return false;
    if (filters.date.to && (!day || day > filters.date.to)) return false;
    if (filters.party && paymentPartyKey(record) !== filters.party) return false;
    if (filters.amount.min !== null && record.amount < filters.amount.min) return false;
    if (filters.amount.max !== null && record.amount > filters.amount.max) return false;
    return true;
}

/** How many filters are active (for the Filter button badge). */
export const activePaymentFilterCount = (filters: PaymentListFilters): number =>
    [!!filters.type, !!filters.party, !!(filters.date.from || filters.date.to), filters.amount.min !== null || filters.amount.max !== null].filter(Boolean).length;
