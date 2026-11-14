import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OrdersHubClient } from "@/components/features/orders-hub/OrdersHubClient";
import { ORDERS_HUB, ORDERS_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Orders | Salamat Innovation ERP",
    description: "Order confirmations and the storefront order workflow.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function OrdersHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(ORDERS_HUB, searchParams, ORDERS_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OrdersHubClient />
        </Suspense>
    );
}
