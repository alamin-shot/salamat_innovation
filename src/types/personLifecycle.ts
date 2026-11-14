// LAYER 1: Person lifecycle — one chronological journey per customer / supplier, aggregated from
// every module's own records (no copy is stored; each module stays its own NestJS resource).
import type { Barcode } from "@/types/barcodes";
import type { PersonKind, PersonRecord } from "@/types/people";
import type { Purchase, PurchaseReturn } from "@/types/purchases";
import type { Sale, SaleReturn } from "@/types/sales";
import type { OrderRecord } from "@/store/useOrderStore";
import type { OrderItem } from "@/hooks/order_confirmation_hooks/useOrderListStore";
import type { PaymentRecord } from "@/types/payments";

export type LifecycleKind =
    | "account_created"
    // customers
    | "order_confirmation"
    | "storefront_order"
    | "order_payment"
    | "sale"
    | "sale_payment"
    | "sale_return"
    | "unit_sold"
    | "payment_received"
    // suppliers
    | "purchase"
    | "purchase_payment"
    | "purchase_return"
    | "unit_received"
    | "payment_sent";

export interface LifecycleEvent {
    id: string;
    /** ISO-8601 */
    at: string;
    kind: LifecycleKind;
    title: string;
    detail: string;
    /** Invoice / order / return number. */
    reference: string | null;
    /** Money shown on the event (taka), or null for non-money events. */
    amount: number | null;
    /**
     * Effect on the running due balance: + increases what the customer owes us (or what we owe
     * the supplier); − reduces it; 0 for informational events.
     */
    dueDelta: number;
    /** Running due after this event (negative = advance / credit in their favour). */
    dueAfter: number;
}

export interface PersonLifecycleSummary {
    /** Sales + storefront orders (customer) or purchases (supplier). */
    billed: number;
    paid: number;
    returned: number;
    /** billed − paid − returned; negative = advance. paid is net of refunds. */
    currentDue: number;
}

export interface PersonLifecycle {
    kind: PersonKind;
    /** Newest first. */
    events: LifecycleEvent[];
    summary: PersonLifecycleSummary;
}

/** Every module's records the engine may draw from. */
export interface LifecycleSources {
    sales: Sale[];
    saleReturns: SaleReturn[];
    storefrontOrders: OrderRecord[];
    orderConfirmations: OrderItem[];
    barcodes: Barcode[];
    purchases: Purchase[];
    purchaseReturns: PurchaseReturn[];
    /** The only source of payments (sales, purchases, orders and manual ones). */
    payments: PaymentRecord[];
}

export type { PersonRecord };
