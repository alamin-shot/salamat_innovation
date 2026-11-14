import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { DailyClosingClient } from "@/components/features/daily_closing/DailyClosingClient";
import { DAILY_CLOSING_HUB, CLOSING_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Daily Closing | Salamat Innovation ERP",
    description: "End of Day (EOD) financial reconciliation and Z-Report management.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function DailyClosingHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(DAILY_CLOSING_HUB, searchParams, CLOSING_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <DailyClosingClient />
        </Suspense>
    );
}
