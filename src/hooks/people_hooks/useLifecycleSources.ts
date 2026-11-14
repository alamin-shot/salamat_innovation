import { useMemo } from "react";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useOrderListStore } from "@/hooks/order_confirmation_hooks/useOrderListStore";
import { LifecycleSources } from "@/types/personLifecycle";

/** Every module's records the ledger reads (each becomes its own API call later). */
export function useLifecycleSources(): LifecycleSources {
    const sales = useGlobalSalesStore((state) => state.sales);
    const saleReturns = useGlobalSalesStore((state) => state.saleReturns);
    const purchases = useGlobalPurchasesStore((state) => state.purchases);
    const purchaseReturns = useGlobalPurchasesStore((state) => state.purchaseReturns);
    const barcodes = useGlobalBarcodesStore((state) => state.barcodes);
    const storefrontOrders = useOrderStore((state) => state.orders);
    const orderConfirmations = useOrderListStore((state) => state.orders);
    const payments = useGlobalPaymentsStore((state) => state.payments);

    return useMemo(
        () => ({ sales, saleReturns, purchases, purchaseReturns, barcodes, storefrontOrders, orderConfirmations, payments }),
        [sales, saleReturns, purchases, purchaseReturns, barcodes, storefrontOrders, orderConfirmations, payments]
    );
}
