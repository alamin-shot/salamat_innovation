import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InvoicePaymentLine, PaymentError, PaymentRecord, PaymentsState } from "@/types/payments";
import { INITIAL_PAYMENTS } from "@/mocks/payments.mock";
import { PAYMENTS_AUDIT_ACTOR } from "@/constants/payments";
import { nextPaymentNumber } from "@/utils/paymentRules";
import { toIsoDate } from "@/utils/dateRules";

// LAYER 2: Payments cache (future /api/payments). The only place paid amounts are stored:
// sales, purchases and orders derive their paid / due from these records.

const roundTaka = (value: number) => Math.round(value * 100) / 100;

function lineError(lines: InvoicePaymentLine[]): PaymentError | null {
    if (lines.some((line) => !Number.isFinite(line.amount) || line.amount < 0)) return "amount_invalid";
    if (lines.some((line) => line.amount > 0 && !line.method.trim())) return "method_required";
    return null;
}

export const useGlobalPaymentsStore = create<PaymentsState>()(
    persist(
        (set, get) => ({
            payments: INITIAL_PAYMENTS,

            addPayment: (input) => {
                if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, error: "amount_invalid" };
                if (!input.method.trim()) return { ok: false, error: "method_required" };
                if (!input.contact.trim()) return { ok: false, error: "party_required" };
                const date = toIsoDate(input.date);
                if (!date) return { ok: false, error: "date_invalid" };

                const record: PaymentRecord = {
                    ...input,
                    id: `pay-${Date.now()}`,
                    number: nextPaymentNumber(get().payments.map((payment) => payment.number)),
                    date,
                    amount: roundTaka(input.amount),
                    method: input.method.trim(),
                    note: input.note.trim() || "-",
                    createdAt: new Date().toISOString(),
                    createdBy: PAYMENTS_AUDIT_ACTOR,
                };
                set((state) => ({ payments: [record, ...state.payments] }));
                return { ok: true, record };
            },

            setInvoicePayments: (input) => {
                const error = lineError(input.lines);
                if (error) return error;
                const date = toIsoDate(input.date);
                if (!date) return "date_invalid";

                const existing = get().payments.filter((record) => record.invoiceRef === input.invoiceRef);
                const numbers = get().payments.map((record) => record.number);
                const now = new Date().toISOString();

                const next: PaymentRecord[] = input.lines.filter((line) => line.amount > 0).map((line, index) => {
                    const kept = existing.find((record) => record.id === line.id);
                    if (kept) return { ...kept, amount: roundTaka(line.amount), method: line.method.trim() };
                    const number = nextPaymentNumber(numbers);
                    numbers.push(number);
                    return {
                        id: `pay-${Date.now()}-${index}`,
                        number,
                        personId: input.personId,
                        contact: input.contact,
                        contactPhone: input.contactPhone,
                        businessName: input.businessName,
                        date,
                        type: input.type,
                        amount: roundTaka(line.amount),
                        method: line.method.trim(),
                        invoiceRef: input.invoiceRef,
                        source: input.source,
                        note: "-",
                        createdAt: now,
                        createdBy: PAYMENTS_AUDIT_ACTOR,
                    };
                });

                set((state) => ({
                    payments: [...next.filter((record) => !existing.some((old) => old.id === record.id)),
                        ...state.payments
                            .filter((record) => record.invoiceRef !== input.invoiceRef || next.some((kept) => kept.id === record.id))
                            .map((record) => next.find((kept) => kept.id === record.id) ?? record)],
                }));
                return null;
            },

            deletePayments: (ids) => set((state) => ({ payments: state.payments.filter((record) => !ids.includes(record.id)) })),

            // Records the invoice posted itself go with it; a manually recorded payment stays as on-account money.
            deleteInvoicePayments: (invoiceRefs) => set((state) => ({
                payments: state.payments
                    .filter((record) => !(record.invoiceRef && invoiceRefs.includes(record.invoiceRef) && record.source !== "manual"))
                    .map((record) => (record.invoiceRef && invoiceRefs.includes(record.invoiceRef) ? { ...record, invoiceRef: null } : record)),
            })),
        }),
        { name: "erp-payments-storage-v1" }
    )
);
