import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { PaymentError } from "@/types/payments";
import { Sale, SalePayment } from "@/types/sales";
import { usePeopleStore } from "@/store/usePeopleStore";

/**
 * Posts a sale's payment rows as Payment records (the only place payments are stored).
 * Re-posting replaces that invoice's records, so Edit Sale can add, change or remove instalments.
 */
export function useSalePayments() {
    const setInvoicePayments = useGlobalPaymentsStore((state) => state.setInvoicePayments);
    const people = usePeopleStore((state) => state.people);

    return (sale: Pick<Sale, "invoiceNumber" | "customerId" | "customerName" | "createdAt">, lines: SalePayment[], date?: string): PaymentError | null => {
        const customer = people.find((person) => person.id === sale.customerId) ?? null;
        return setInvoicePayments({
            invoiceRef: sale.invoiceNumber,
            source: "sale",
            type: "payment received",
            date: date ?? sale.createdAt,
            personId: sale.customerId,
            contact: sale.customerName,
            contactPhone: customer && customer.phoneNumber !== "-" ? customer.phoneNumber : null,
            businessName: customer?.businessName ?? "-",
            lines,
        });
    };
}
