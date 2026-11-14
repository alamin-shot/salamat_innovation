import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SettingsHubClient } from "@/components/features/settings/SettingsHubClient";
import { SETTINGS_HUB, SETTINGS_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Settings | Salamat Innovation ERP",
    description: "Enterprise configurations, security and operations.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function SettingsHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(SETTINGS_HUB, searchParams, SETTINGS_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SettingsHubClient />
        </Suspense>
    );
}
