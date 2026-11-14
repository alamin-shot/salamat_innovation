import { toast } from "sonner";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { PurchaseLineItem, PurchaseReceiveInput } from "@/types/purchases";
import { PURCHASES_AUDIT_ACTOR } from "@/constants/purchases";

/**
 * A saved purchase receives its scanned units in the Barcodes module (status → Received,
 * with supplier, location, unit price and the PP- reference). Forward flow only for now:
 * removing a row later does not reverse it.
 */
export function useReceivePurchasedUnits() {
    const recordReceived = useGlobalBarcodesStore((state) => state.recordReceived);

    return (items: PurchaseLineItem[], input: PurchaseReceiveInput) => {
        const refused: string[] = [];
        items.forEach((item) => {
            if (!item.barcodeId) {
                return;
            }
            const result = recordReceived(item.barcodeId, {
                supplier: { id: null, name: input.supplier, role: "Supplier" },
                location: input.location,
                price: item.unitPrice,
                reference: input.invoiceNumber,
            }, PURCHASES_AUDIT_ACTOR);
            result.rejected.forEach((rejection) => refused.push(`${rejection.target}: ${rejection.reason}`));
        });
        if (refused.length > 0) {
            toast.warning(`Saved, but ${refused.length} unit(s) could not be marked Received: ${refused.join("; ")}`);
        }
    };
}
