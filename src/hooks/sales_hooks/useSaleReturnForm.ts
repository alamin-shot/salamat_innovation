import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { SaleReturn, SaleReturnItem, SalesError, SalesSaveResult } from "@/types/sales";
import { computeSaleReturnTotals } from "@/utils/salesMath";
import { findSaleByInvoice, lookupSoldUnit, returnableItems } from "@/utils/saleReturnRules";

const RETURN_ERRORS: Record<SalesError, string> = {
    customer_required: "Scan a sold serial or an invoice first; the customer comes from that sale.",
    items_required: "Add at least one item to return.",
    serial_duplicate: "The same serial is in the return twice.",
    serial_already_returned: "A unit in this list was already returned.",
    customer_mismatch: "Cannot save: an item was sold to a different customer.",
    amount_invalid: "Each refund must be between 0 and the price paid.",
};

/**
 * Add / Edit Sale Return. The customer is never typed or picked: it comes from the original sale of
 * the first scanned unit (or invoice) and is locked; units sold to anyone else are refused.
 * Mount with `key={existing?.id ?? "new"}`.
 */
export function useSaleReturnForm(existing: SaleReturn | null, onSaved: (result: Extract<SalesSaveResult, { ok: true }>) => void) {
    const sales = useGlobalSalesStore((state) => state.sales);
    const allReturns = useGlobalSalesStore((state) => state.saleReturns);
    const addSaleReturn = useGlobalSalesStore((state) => state.addSaleReturn);
    const updateSaleReturn = useGlobalSalesStore((state) => state.updateSaleReturn);

    // When editing, this return's own units must not count as "already returned".
    const otherReturns = useMemo(() => allReturns.filter((record) => record.id !== existing?.id), [allReturns, existing?.id]);

    const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<SaleReturnItem[]>(existing?.items ?? []);
    const [discount, setDiscount] = useState(existing?.discount ?? 0);
    const [orderTaxPct, setOrderTaxPct] = useState(existing?.orderTaxPct ?? 0);
    const [shippingCost, setShippingCost] = useState(existing?.shippingCost ?? 0);
    const [scanQuery, setScanQuery] = useState("");
    const [firstCustomer, setFirstCustomer] = useState<{ id: string | null; name: string } | null>(null);

    // Edit: the return's own customer, always. Add: whoever the first item was sold to (cleared when empty).
    const customer = existing ? { id: existing.customerId, name: existing.customerName } : items.length > 0 ? firstCustomer : null;
    const context = { lockedCustomerId: customer?.id ?? null, lockedCustomerName: customer?.name ?? null, inList: items.map((item) => item.serial) };

    const append = (newItems: Omit<SaleReturnItem, "id">[], owner: { id: string | null; name: string }) => {
        if (!customer) setFirstCustomer(owner);
        setItems((prev) => [...prev, ...newItems.map((item) => ({ ...item, id: crypto.randomUUID() }))]);
        setScanQuery("");
    };

    /** Enter: an invoice number adds its remaining units; otherwise the text is treated as a serial. */
    const scan = () => {
        const sale = findSaleByInvoice(sales, scanQuery);
        if (sale) {
            if (customer && (sale.customerId ?? sale.customerName) !== (customer.id ?? customer.name)) {
                toast.error(`Cannot add items: Invoice ${sale.invoiceNumber} belongs to ${sale.customerName}, not ${customer.name}.`);
                return;
            }
            const inList = new Set(context.inList.map((serial) => serial.trim().toUpperCase()));
            const remaining = returnableItems(sale, otherReturns).filter((item) => !inList.has(item.serial.trim().toUpperCase()));
            if (remaining.length === 0) {
                toast.error(`Every unit of ${sale.invoiceNumber} is already returned or in this list.`);
                return;
            }
            append(remaining.map((item) => ({
                saleId: sale.id, saleInvoice: sale.invoiceNumber, barcodeId: item.barcodeId, productName: item.productName,
                variant: item.variant, sku: item.sku, serial: item.serial, unitPrice: item.salePrice, refundAmount: item.salePrice,
            })), { id: sale.customerId, name: sale.customerName });
            toast.success(`${remaining.length} unit(s) from ${sale.invoiceNumber} added.`);
            return;
        }
        const result = lookupSoldUnit(sales, otherReturns, scanQuery, context);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        append([result.item], { id: result.customerId, name: result.customerName });
    };

    const setRefund = (id: string, refundAmount: number) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, refundAmount } : item)));
    const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

    const totals = computeSaleReturnTotals({ items, discount, orderTaxPct, shippingCost });

    const save = () => {
        if (!customer) {
            toast.error(RETURN_ERRORS.customer_required);
            return;
        }
        const input = { customerId: customer.id, customerName: customer.name, date, items, discount, orderTaxPct, shippingCost };
        const result = existing ? updateSaleReturn(existing.id, input) : addSaleReturn(input);
        if (!result.ok) {
            toast.error(RETURN_ERRORS[result.error]);
            return;
        }
        toast.success(existing ? `Sale return ${result.number} updated.` : `Sale return ${result.number} saved.`);
        onSaved(result);
    };

    return {
        isEdit: !!existing, returnNumber: existing?.returnNumber ?? null,
        customer, date, setDate,
        scanQuery, setScanQuery, scan,
        items, setRefund, removeItem,
        discount, setDiscount, orderTaxPct, setOrderTaxPct, shippingCost, setShippingCost,
        totals, save,
    };
}

export type SaleReturnFormManager = ReturnType<typeof useSaleReturnForm>;
