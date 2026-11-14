import type { AmountRangeValue, DateRangeValue } from "@/types/ui";
import type { PersonType } from "@/types/people";

// LAYER 1: Payments — the single source of every taka paid or received (future /api/payments).
// Invoices (sales, purchases, storefront orders) never store a paid amount; their paid / due is
// derived from the payment records that reference them.

export type PaymentDirection = "payment sent" | "payment received";

/** Where the record was posted from. */
export type PaymentSource = "manual" | "sale" | "purchase" | "order";

export interface PaymentRecord {
    id: string;
    /** Payment number: legacy "PP-3594" / "SLT-3593" / "PMT-3589", new ones "PAY-3595". */
    number: string;
    /** People profile (null when a legacy party could not be linked; then matched by name / phone). */
    personId: string | null;
    contact: string;
    contactPhone: string | null;
    businessName: string;
    /** ISO-8601 */
    date: string;
    type: PaymentDirection;
    /** Always positive; the direction says which way the money moved. */
    amount: number;
    method: string;
    /** Invoice / order number this payment settles, or null for an on-account payment. */
    invoiceRef: string | null;
    source: PaymentSource;
    note: string;
    /** ISO-8601 */
    createdAt: string;
    createdBy: string;
}

/** One payment taken while saving an invoice (Add Sale payment rows, Edit Sale). */
export interface InvoicePaymentLine {
    id: string;
    method: string;
    amount: number;
}

/** Who an invoice's payments belong to. */
export interface PaymentParty {
    personId: string | null;
    contact: string;
    contactPhone: string | null;
    businessName: string;
}

export interface NewPaymentInput extends PaymentParty {
    /** YYYY-MM-DD or ISO */
    date: string;
    type: PaymentDirection;
    amount: number;
    method: string;
    invoiceRef: string | null;
    source: PaymentSource;
    note: string;
}

export interface InvoicePaymentsInput extends PaymentParty {
    invoiceRef: string;
    source: Exclude<PaymentSource, "manual">;
    type: PaymentDirection;
    /** ISO date used for the posted records. */
    date: string;
    lines: InvoicePaymentLine[];
}

export type PaymentError = "amount_invalid" | "method_required" | "party_required" | "date_invalid";

export type PaymentSaveResult = { ok: true; record: PaymentRecord } | { ok: false; error: PaymentError };

export interface PaymentsState {
    payments: PaymentRecord[];
    addPayment: (input: NewPaymentInput) => PaymentSaveResult;
    /** Replaces every record posted for one invoice (Add Sale, Edit Sale, order payments). */
    setInvoicePayments: (input: InvoicePaymentsInput) => PaymentError | null;
    deletePayments: (ids: string[]) => void;
    /** Deleted invoices: drops the records they posted; manual payments that referenced them become on-account. */
    deleteInvoicePayments: (invoiceRefs: string[]) => void;
}

/** Payment List filters; "" / null = not filtered. */
export interface PaymentListFilters {
    type: PaymentDirection | "";
    /** People id, or "name:<contact>" for an unlinked party. */
    party: string;
    date: DateRangeValue;
    amount: AmountRangeValue;
}

/** Payment List row: the record plus the legacy debit / credit columns. */
export type PaymentListRow = PaymentRecord & { debit: number; credit: number };

/**
 * Add Payment row: one People profile with its ledger.
 * debit = invoices billed, credit = payments (net) + returns, balance = debit − credit (the current due).
 */
export interface PaymentPartyRow {
    id: string;
    name: string;
    type: PersonType;
    businessName: string;
    businessLogoUrl?: string;
    phoneNumber: string;
    debit: number;
    credit: number;
    balance: number;
}
