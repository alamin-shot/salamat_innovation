// LAYER 1: Sales & Sale Returns. Future NestJS resources: /api/sales, /api/sale-returns.

/** Derived from payments vs. total, never edited by hand (keeps the customer ledger honest). */
export type SalePaymentStatus = "Paid" | "Partially_paid" | "Due";

/** One sold unit (one Serial/IMEI). */
export interface SaleLineItem {
    id: string;
    /** Barcodes-module unit, when the item was scanned. */
    barcodeId: string | null;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    purchasePrice: number;
    mrp: number;
    salePrice: number;
    quantity: 1;
}

export interface SalePayment {
    id: string;
    method: string;
    amount: number;
}

export interface Sale {
    id: string;
    /** "PS-003268" (POS) or the "INV-…" reference Barcodes recorded for older sales. */
    invoiceNumber: string;
    /** People profile of the customer (null only when a legacy name could not be matched). */
    customerId: string | null;
    customerName: string;
    /** YYYY-MM-DD */
    date: string;
    seller: string;
    address: string;
    items: SaleLineItem[];
    /** Order tax as a percentage of the subtotal (the Add Sale form's existing rule). */
    orderTaxPct: number;
    shippingCost: number;
    additionalChargeName: string;
    additionalChargeAmount: number;
    courier: string;
    /** ISO-8601 */
    createdAt: string;
    createdBy: string;
}

export interface SaleTotals {
    subTotal: number;
    totalDiscount: number;
    tax: number;
    shipping: number;
    additionalCharge: number;
    grandTotal: number;
    received: number;
    due: number;
}

/** Payments taken at the counter are posted as Payment records (useGlobalPaymentsStore), never stored on the sale. */
export type SaleInput = Omit<Sale, "id" | "invoiceNumber" | "createdAt" | "createdBy"> & { payments: SalePayment[] };

/**
 * What Edit Sale may change after the sale: seller, address and payments (e.g. a later instalment).
 * Customer, items and prices stay as sold, so the customer ledger and returns stay consistent.
 */
export type SaleDetailsInput = Pick<Sale, "seller" | "address">;

/** One returned unit, traced back to the sale it came from. */
export interface SaleReturnItem {
    id: string;
    /** null only for legacy returns recorded before sales were stored. */
    saleId: string | null;
    saleInvoice: string | null;
    barcodeId: string | null;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    /** Price the customer paid for the unit. */
    unitPrice: number;
    /** Amount refunded for the unit (defaults to unitPrice; may be lower). */
    refundAmount: number;
}

export interface SaleReturn {
    id: string;
    /** "SR-000293" */
    returnNumber: string;
    /** Locked to one customer: every item must come from a sale to this person. */
    customerId: string | null;
    customerName: string;
    /** YYYY-MM-DD */
    date: string;
    items: SaleReturnItem[];
    discount: number;
    orderTaxPct: number;
    shippingCost: number;
    createdAt: string;
    createdBy: string;
}

export interface SaleReturnTotals {
    subTotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
}

export type SaleReturnInput = Omit<SaleReturn, "id" | "returnNumber" | "createdAt" | "createdBy">;

/** A sold unit found by serial, ready to become a return row, with the customer it locks. */
export type SoldUnitLookup =
    | { ok: true; item: Omit<SaleReturnItem, "id">; customerId: string | null; customerName: string }
    | { ok: false; message: string };

/** Context for adding a unit to the return being built. */
export interface SaleReturnContext {
    /** Set by the first item; null while the return is empty. */
    lockedCustomerId: string | null;
    lockedCustomerName: string | null;
    /** Serials already in the return. */
    inList: string[];
}

export type SalesError =
    | "customer_required"
    | "items_required"
    | "serial_duplicate"
    | "serial_already_returned"
    | "customer_mismatch"
    | "amount_invalid";

export type SalesSaveResult = { ok: true; id: string; number: string } | { ok: false; error: SalesError };

export interface SalesState {
    sales: Sale[];
    saleReturns: SaleReturn[];
    addSale: (input: SaleInput) => SalesSaveResult;
    deleteSales: (ids: string[]) => void;
    setSaleCourier: (id: string, courier: string) => void;
    setSaleSeller: (id: string, seller: string) => void;
    updateSaleDetails: (id: string, input: SaleDetailsInput) => SalesSaveResult;
    /** Refuses units from another customer's sale, units already returned, and duplicate serials. */
    addSaleReturn: (input: SaleReturnInput) => SalesSaveResult;
    /** Same rules as adding; the return keeps its customer and number. */
    updateSaleReturn: (id: string, input: SaleReturnInput) => SalesSaveResult;
    deleteSaleReturns: (ids: string[]) => void;
}

/** A sale as the Sale List shows it: totals and payment status derived from items + payments. */
/** List row: the sale plus its payments (from Payment records) and derived totals / status. */
export type SaleRow = Sale & { payments: SalePayment[]; totals: SaleTotals; status: SalePaymentStatus; paymentMethods: string };

/** Result of scanning a serial into Add Sale. */
export type SellableUnitLookup = { ok: true; item: SaleLineItem } | { ok: false; message: string };

/** A sale return as the list shows it, with its computed totals. */
export type SaleReturnRow = SaleReturn & { totals: SaleReturnTotals };
