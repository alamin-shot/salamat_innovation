import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { usePartyResolver } from "@/hooks/people_hooks/usePartyResolver";
import { OrderRecord } from "@/store/useOrderStore";
import { PaymentError } from "@/types/payments";

/**
 * A storefront order's received amount as a Payment record (the ledger's only payment source).
 * The order drawer does not ask for a method, so none is recorded ("-").
 */
export function usePostOrderPayment() {
    const addPayment = useGlobalPaymentsStore((state) => state.addPayment);
    const resolveCustomer = usePartyResolver("customer");

    return (order: Pick<OrderRecord, "orderNumber" | "customerName" | "customerPhone">, amount: number): PaymentError | null => {
        const result = addPayment({
            personId: resolveCustomer({ phone: order.customerPhone, name: order.customerName }),
            contact: order.customerName,
            contactPhone: order.customerPhone || null,
            businessName: "-",
            date: new Date().toISOString(),
            type: "payment received",
            amount,
            method: "-",
            invoiceRef: order.orderNumber,
            source: "order",
            note: "-",
        });
        return result.ok ? null : result.error;
    };
}
