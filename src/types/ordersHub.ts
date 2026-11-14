// LAYER 1: Orders hub (routing only). Order Confirmation and Orders keep their own stores:
// hooks/order_confirmation_hooks/useOrderListStore · useOrderOptionsStore, and store/useOrderStore.
import type { OrderStatus } from "@/store/useOrderStore";

export type OrdersHubTabKey = "order_list" | "order_options" | "orders";

/** `?status=` filter inside the Orders spoke (replaces the 10 separate status pages). */
export type OrderStatusFilter = "All" | OrderStatus;
