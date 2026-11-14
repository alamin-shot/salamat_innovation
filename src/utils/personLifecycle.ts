import { LifecycleEvent, LifecycleKind, LifecycleSources, PersonLifecycle } from "@/types/personLifecycle";
import { PersonKind, PersonRecord } from "@/types/people";
import { PERSON_TYPE_KIND } from "@/constants/people";
import { computePurchaseTotals } from "@/utils/purchaseMath";
import { computeSaleReturnTotals, computeSaleTotals } from "@/utils/salesMath";
import { toIsoDate, toTimestamp } from "@/utils/dateRules";
import { isSamePhone } from "@/utils/phoneRules";
import { PaymentRecord, PaymentSource } from "@/types/payments";

// Pure lifecycle engine: one person + every module's records → their chronological journey and
// running due balance. Links by stored person id first; legacy records fall back to phone, then exact name.
// Due = invoices − payments − returns, where payments come ONLY from Payment records (never from
// amounts stored on an invoice), so nothing is counted twice.

type Draft = Omit<LifecycleEvent, "dueAfter"> & { order: number };

const same = (a: string | null | undefined, b: string | null | undefined) => {
    const left = a?.trim().toLowerCase();
    return !!left && left !== "-" && left !== "—" && left === b?.trim().toLowerCase();
};

/** True when a record that names a party belongs to this person. */
function belongs(person: PersonRecord, linkedId: string | null | undefined, phone?: string | null, ...names: (string | null | undefined)[]): boolean {
    if (linkedId) return linkedId === person.id;
    if (phone && isSamePhone(phone, person.phoneNumber)) return true;
    return names.some((name) => same(name, person.name) || same(name, person.businessName));
}

const money = (amount: number) => Math.round(amount * 100) / 100;

function customerEvents(person: PersonRecord, sources: LifecycleSources, push: (event: Omit<Draft, "order">) => void) {
    sources.sales.filter((sale) => belongs(person, sale.customerId, null, sale.customerName)).forEach((sale) => {
        const totals = computeSaleTotals({ ...sale, payments: [] });
        push({ id: `sale-${sale.id}`, at: sale.createdAt, kind: "sale", title: "Sale", detail: `${sale.items.length} item(s) sold by ${sale.seller}`, reference: sale.invoiceNumber, amount: totals.grandTotal, dueDelta: totals.grandTotal });
    });

    sources.saleReturns.filter((record) => belongs(person, record.customerId, null, record.customerName)).forEach((record) => {
        const total = computeSaleReturnTotals(record).total;
        push({ id: `sret-${record.id}`, at: record.createdAt, kind: "sale_return", title: "Sale return", detail: `${record.items.length} item(s) returned`, reference: record.returnNumber, amount: total, dueDelta: -total });
    });

    sources.storefrontOrders.filter((order) => belongs(person, null, order.customerPhone, order.customerName)).forEach((order) => {
        const at = toIsoDate(order.date) ?? person.createdAt;
        // Rejected and returned orders are shown but owe nothing.
        const counts = order.status !== "Rejected" && order.status !== "Return";
        push({ id: `order-${order.id}`, at, kind: "storefront_order", title: `Storefront order (${order.status})`, detail: `${order.items.length} item(s)`, reference: order.orderNumber, amount: order.grandTotal, dueDelta: counts ? order.grandTotal : 0 });
    });

    sources.orderConfirmations.filter((order) => belongs(person, order.customerId, order.customerPhone, order.customer)).forEach((order) => {
        push({ id: `oc-${order.id}`, at: toIsoDate(order.confirmationDate) ?? toIsoDate(order.date) ?? person.createdAt, kind: "order_confirmation", title: "Order confirmed", detail: `${order.product} via ${order.orderMedia}`, reference: order.invoiceNo !== "-" ? order.invoiceNo : null, amount: order.sellingPrice, dueDelta: 0 });
    });

    sources.barcodes.forEach((barcode) => barcode.lifecycleEvents.forEach((event) => {
        if (event.type !== "Sold" || !belongs(person, event.customer.id, null, event.customer.name)) return;
        push({ id: `unit-${event.id}`, at: event.timestamp, kind: "unit_sold", title: "Unit sold", detail: `${barcode.productName} · ${barcode.serialNumber}`, reference: event.reference, amount: event.price, dueDelta: 0 });
    }));
}

function supplierEvents(person: PersonRecord, sources: LifecycleSources, push: (event: Omit<Draft, "order">) => void) {
    sources.purchases.filter((purchase) => belongs(person, purchase.supplierId, null, purchase.supplier)).forEach((purchase) => {
        const at = toIsoDate(purchase.date) ?? person.createdAt;
        const total = computePurchaseTotals(purchase.items, purchase.costing).total;
        push({ id: `pur-${purchase.id}`, at, kind: "purchase", title: "Purchase", detail: `${purchase.items.length} unit(s) into ${purchase.location}`, reference: purchase.invoiceNumber, amount: total, dueDelta: total });
    });

    sources.purchaseReturns.filter((record) => belongs(person, record.supplierId, null, record.supplier, record.company)).forEach((record) => {
        const total = computePurchaseTotals(record.items, record.costing).total;
        push({ id: `pret-${record.id}`, at: toIsoDate(record.date) ?? person.createdAt, kind: "purchase_return", title: "Purchase return", detail: `${record.items.length} unit(s) returned · ৳${record.dueAmount.toLocaleString("en-IN")} still due from supplier`, reference: record.invoiceNumber, amount: total, dueDelta: -total });
    });

    sources.barcodes.forEach((barcode) => barcode.lifecycleEvents.forEach((event) => {
        if (event.type !== "Received" || !belongs(person, event.supplier.id, null, event.supplier.name)) return;
        push({ id: `unit-${event.id}`, at: event.timestamp, kind: "unit_received", title: "Unit received", detail: `${barcode.productName} · ${barcode.serialNumber}`, reference: event.reference, amount: event.price, dueDelta: 0 });
    }));
}

const SOURCE_KIND: Record<PaymentSource, LifecycleKind | null> = { sale: "sale_payment", order: "order_payment", purchase: "purchase_payment", manual: null };

/**
 * Every Payment record of this person. Money that settles their balance (received from a customer,
 * sent to a supplier) lowers the due; money moving the other way (a refund) raises it again.
 */
function paymentEvents(person: PersonRecord, kind: PersonKind, sources: LifecycleSources, push: (event: Omit<Draft, "order">) => void) {
    const settling: PaymentRecord["type"] = kind === "customer" ? "payment received" : "payment sent";
    sources.payments.filter((record) => belongs(person, record.personId, record.contactPhone, record.contact, record.businessName)).forEach((record) => {
        const settles = record.type === settling;
        const direction = record.type === "payment received" ? "Payment received" : "Payment sent";
        const method = record.method && record.method !== "-" ? ` (${record.method})` : "";
        push({
            id: `pay-${record.id}`,
            at: record.date,
            kind: SOURCE_KIND[record.source] ?? (record.type === "payment received" ? "payment_received" : "payment_sent"),
            title: `${direction}${method}${settles ? "" : " · refund"}`,
            detail: record.invoiceRef ? `${record.number} against ${record.invoiceRef}` : `${record.number} · on account`,
            reference: record.invoiceRef ?? record.number,
            amount: record.amount,
            dueDelta: settles ? -record.amount : record.amount,
        });
    });
}

const BILLED: LifecycleKind[] = ["sale", "storefront_order", "purchase"];
const PAID: LifecycleKind[] = ["sale_payment", "order_payment", "payment_received", "purchase_payment", "payment_sent"];
const RETURNED: LifecycleKind[] = ["sale_return", "purchase_return"];

/** The full journey of one person, newest first, with the running due after every event. */
export function buildPersonLifecycle(person: PersonRecord, sources: LifecycleSources): PersonLifecycle {
    const kind: PersonKind = PERSON_TYPE_KIND[person.type];
    const drafts: Draft[] = [];
    const push = (event: Omit<Draft, "order">) => drafts.push({ ...event, order: drafts.length });

    push({ id: `created-${person.id}`, at: person.createdAt, kind: "account_created", title: "Profile created", detail: `Added as ${person.type}`, reference: null, amount: null, dueDelta: 0 });
    if (kind === "customer") customerEvents(person, sources, push);
    else supplierEvents(person, sources, push);
    paymentEvents(person, kind, sources, push);

    // Oldest first for the running balance; insertion order breaks ties (a sale before its payment).
    drafts.sort((a, b) => toTimestamp(a.at) - toTimestamp(b.at) || a.order - b.order);
    let running = 0;
    const events: LifecycleEvent[] = drafts.map((draft) => {
        running = money(running + draft.dueDelta);
        return {
            id: draft.id, at: draft.at, kind: draft.kind, title: draft.title, detail: draft.detail,
            reference: draft.reference, amount: draft.amount, dueDelta: money(draft.dueDelta), dueAfter: running,
        };
    });

    const sumOf = (kinds: LifecycleKind[]) => money(events.filter((event) => kinds.includes(event.kind)).reduce((sum, event) => sum + Math.abs(event.dueDelta), 0));
    const billed = sumOf(BILLED);
    // Net of refunds: money paid back to the party counts against what they paid.
    const paid = money(-events.filter((event) => PAID.includes(event.kind)).reduce((sum, event) => sum + event.dueDelta, 0));
    const returned = sumOf(RETURNED);

    return {
        kind,
        events: events.reverse(),
        summary: { billed, paid, returned, currentDue: money(billed - paid - returned) },
    };
}
