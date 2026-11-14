import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderStatusFilter } from "@/types/ordersHub";
import { ORDER_STATUS_FLOW } from "@/constants/hub";

/**
 * `?status=` filter of the Orders spoke (replaces the nine old status pages). Unknown values fall
 * back to "All". Counts are live from the order store.
 */
export function useOrderStatusFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const orders = useOrderStore((state) => state.orders);

    const requested = searchParams.get("status");
    const status: OrderStatusFilter = ORDER_STATUS_FLOW.find((value) => value === requested) ?? "All";

    const counts = useMemo(() => {
        const byStatus = Object.fromEntries(ORDER_STATUS_FLOW.map((value) => [value, 0])) as Record<OrderStatusFilter, number>;
        orders.forEach((order) => { byStatus[order.status] += 1; });
        byStatus.All = orders.length;
        return byStatus;
    }, [orders]);

    const setStatus = useCallback((next: OrderStatusFilter) => {
        const params = new URLSearchParams(searchParams.toString());
        ["drawer", "modal", "id", "page", "search"].forEach((key) => params.delete(key));
        if (next === "All") params.delete("status");
        else params.set("status", next);
        startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
    }, [pathname, router, searchParams]);

    return { status, setStatus, counts, isPending };
}
