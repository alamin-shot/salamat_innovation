import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Sale, SaleReturn, SaleReturnInput, SalesError, SalesState } from "@/types/sales";
import { INITIAL_SALE_RETURNS, INITIAL_SALES } from "@/mocks/sales.mock";
import { findExistingReturn } from "@/utils/saleReturnRules";

// LAYER 2: Sales and Sale Returns (future /api/sales, /api/sale-returns). Totals are always
// recomputed by utils/salesMath; the store keeps line items and costing inputs only. Payments are
// Payment records (useGlobalPaymentsStore) that reference the invoice number.

const SALES_AUDIT_ACTOR = "Admin";
const key = (serial: string) => serial.trim().toUpperCase();

/** Next number in a "PS-003268" / "SR-000293" series (6 digits). */
function nextNumber(prefix: "PS" | "SR", existing: string[]): string {
    const highest = existing.reduce((max, value) => {
        const match = value.match(new RegExp(`^${prefix}-(\\d+)$`));
        return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${String(highest + 1).padStart(6, "0")}`;
}

const hasDuplicateSerial = (serials: string[]) => new Set(serials.map(key)).size !== serials.length;

/**
 * Sale Return rules, shared by add and edit: one customer, units from that customer's sales only,
 * no unit returned twice, refund between 0 and the price paid.
 */
function saleReturnError(input: SaleReturnInput, sales: Sale[], otherReturns: SaleReturn[]): SalesError | null {
    if (!input.customerName.trim()) return "customer_required";
    if (input.items.length === 0) return "items_required";
    if (hasDuplicateSerial(input.items.map((item) => item.serial))) return "serial_duplicate";
    if (input.items.some((item) => !Number.isFinite(item.refundAmount) || item.refundAmount < 0 || item.refundAmount > item.unitPrice)) return "amount_invalid";
    for (const item of input.items) {
        if (!item.saleId) continue;
        const sale = sales.find((record) => record.id === item.saleId);
        if (!sale || (sale.customerId ?? sale.customerName) !== (input.customerId ?? input.customerName)) return "customer_mismatch";
        if (findExistingReturn(otherReturns, item.serial, item.saleId)) return "serial_already_returned";
    }
    return null;
}

export const useGlobalSalesStore = create<SalesState>()(
    persist(
        (set, get) => ({
            sales: INITIAL_SALES as Sale[],
            saleReturns: INITIAL_SALE_RETURNS as SaleReturn[],

            addSale: (input) => {
                if (!input.customerName.trim()) return { ok: false, error: "customer_required" };
                if (input.items.length === 0) return { ok: false, error: "items_required" };
                if (hasDuplicateSerial(input.items.map((item) => item.serial))) return { ok: false, error: "serial_duplicate" };
                const amounts = [...input.items.map((item) => item.salePrice), ...input.payments.map((payment) => payment.amount), input.shippingCost, input.additionalChargeAmount];
                if (amounts.some((amount) => !Number.isFinite(amount) || amount < 0)) return { ok: false, error: "amount_invalid" };

                const sale: Sale = {
                    customerId: input.customerId,
                    customerName: input.customerName,
                    date: input.date,
                    seller: input.seller,
                    address: input.address,
                    orderTaxPct: input.orderTaxPct,
                    shippingCost: input.shippingCost,
                    additionalChargeName: input.additionalChargeName,
                    additionalChargeAmount: input.additionalChargeAmount,
                    courier: input.courier,
                    id: `sale-${Date.now()}`,
                    invoiceNumber: nextNumber("PS", get().sales.map((record) => record.invoiceNumber)),
                    items: input.items.map((item) => ({ ...item, quantity: 1 as const })),
                    createdAt: new Date().toISOString(),
                    createdBy: SALES_AUDIT_ACTOR,
                };
                set((state) => ({ sales: [sale, ...state.sales] }));
                return { ok: true, id: sale.id, number: sale.invoiceNumber };
            },

            deleteSales: (ids) => set((state) => ({ sales: state.sales.filter((sale) => !ids.includes(sale.id)) })),

            setSaleCourier: (id, courier) => set((state) => ({
                sales: state.sales.map((sale) => (sale.id === id ? { ...sale, courier } : sale)),
            })),

            setSaleSeller: (id, seller) => set((state) => ({
                sales: state.sales.map((sale) => (sale.id === id ? { ...sale, seller } : sale)),
            })),

            updateSaleDetails: (id, input) => {
                const target = get().sales.find((sale) => sale.id === id);
                if (!target) return { ok: false, error: "items_required" };
                set((state) => ({
                    sales: state.sales.map((sale) => (sale.id === id ? { ...sale, seller: input.seller, address: input.address } : sale)),
                }));
                return { ok: true, id, number: target.invoiceNumber };
            },

            addSaleReturn: (input) => {
                const error = saleReturnError(input, get().sales, get().saleReturns);
                if (error) return { ok: false, error };
                const record: SaleReturn = {
                    ...input,
                    id: `sret-${Date.now()}`,
                    returnNumber: nextNumber("SR", get().saleReturns.map((existing) => existing.returnNumber)),
                    createdAt: new Date().toISOString(),
                    createdBy: SALES_AUDIT_ACTOR,
                };
                set((state) => ({ saleReturns: [record, ...state.saleReturns] }));
                return { ok: true, id: record.id, number: record.returnNumber };
            },

            updateSaleReturn: (id, input) => {
                const target = get().saleReturns.find((record) => record.id === id);
                if (!target) return { ok: false, error: "items_required" };
                // The customer never changes on an existing return.
                const locked: SaleReturnInput = { ...input, customerId: target.customerId, customerName: target.customerName };
                const error = saleReturnError(locked, get().sales, get().saleReturns.filter((record) => record.id !== id));
                if (error) return { ok: false, error };
                set((state) => ({ saleReturns: state.saleReturns.map((record) => (record.id === id ? { ...record, ...locked } : record)) }));
                return { ok: true, id, number: target.returnNumber };
            },

            deleteSaleReturns: (ids) => set((state) => ({ saleReturns: state.saleReturns.filter((record) => !ids.includes(record.id)) })),
        }),
        {
            name: "erp-sales-storage-v1",
            version: 1,
            // version 1: payments moved to Payment records; drop the copy stored on each sale.
            migrate: (persisted, version) => {
                const state = persisted as { sales?: (Sale & { payments?: unknown })[]; saleReturns?: SaleReturn[] };
                if (version < 1 && state.sales) {
                    state.sales = state.sales.map((sale) => {
                        const clean: Sale & { payments?: unknown } = { ...sale };
                        delete clean.payments;
                        return clean;
                    });
                }
                return state as SalesState;
            },
        }
    )
);
