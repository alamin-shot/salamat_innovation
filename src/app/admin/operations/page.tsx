import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OperationsClient } from "@/components/features/operations/OperationsClient";
import { OPERATIONS_HUB, OPERATIONS_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Operations | Salamat Innovation ERP",
    description: "Stock transfers, damage products, assets and cash transfers.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function OperationsHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(OPERATIONS_HUB, searchParams, OPERATIONS_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OperationsClient />
        </Suspense>
    );
}
