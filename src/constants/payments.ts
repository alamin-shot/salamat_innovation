import { PaymentError, PaymentListFilters } from "@/types/payments";
import { PersonType } from "@/types/people";

/** Methods offered on Add Payment's Send / Receive forms. */
export const PAYMENT_METHODS = ["Cash", "Bkash", "Nagad", "Bank Transfer"] as const;

/** New payment numbers continue the legacy sequence with this prefix. */
export const PAYMENT_NUMBER_PREFIX = "PAY";

/** Stamped as Created By until the live auth session is wired. */
export const PAYMENTS_AUDIT_ACTOR = "Admin";

export const PAYMENT_ERRORS: Readonly<Record<PaymentError, string>> = {
    amount_invalid: "Enter a valid amount greater than 0.",
    method_required: "Payment method is required.",
    party_required: "Choose who the payment is for.",
    date_invalid: "Choose a valid date.",
};

export const EMPTY_PAYMENT_FILTERS: PaymentListFilters = {
    type: "",
    party: "",
    date: { from: null, to: null },
    amount: { min: null, max: null },
};

export const PAYMENT_TYPE_OPTIONS = [
    { label: "Payment Sent", value: "payment sent" },
    { label: "Payment Received", value: "payment received" },
];

/** Add Payment filter: the People types (same as the People page). */
export const PARTY_TYPE_OPTIONS: { label: string; value: PersonType }[] = [
    { label: "Online Customer", value: "Online Customer" },
    { label: "Offline Customer", value: "Offline Customer" },
    { label: "Supplier", value: "Supplier" },
];
