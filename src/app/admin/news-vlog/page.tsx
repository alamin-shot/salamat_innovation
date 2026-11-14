import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { NewsVlogClient } from "@/components/features/news-vlog/NewsVlogClient";
import { NEWS_VLOG_HUB, NEWS_VLOG_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "News & Vlog | Salamat Innovation ERP",
    description: "News articles and video vlogs for the storefront.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function NewsVlogHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(NEWS_VLOG_HUB, searchParams, NEWS_VLOG_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <NewsVlogClient />
        </Suspense>
    );
}
