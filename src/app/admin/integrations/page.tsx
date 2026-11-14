import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { IntegrationsClient } from "@/components/features/integrations/IntegrationsClient";
import { INTEGRATIONS_HUB, INTEGRATIONS_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Integrations & API | Salamat Innovation ERP",
    description: "Manage sales channels, couriers, and developer webhooks.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function IntegrationsAPIHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(INTEGRATIONS_HUB, searchParams, INTEGRATIONS_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <IntegrationsClient />
        </Suspense>
    );
}
