import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SeoHubClient } from "@/components/features/seo-hub/SeoHubClient";
import { SEO_HUB, SEO_SPOKE_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectLegacyHubTab } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "SEO | Salamat Innovation ERP",
    description: "Site settings, page metadata, social tags, sitemap and robots.txt for Salamat and TEKZO.",
};

/** Hub portal. Each spoke card opens its own full page; old ?tab= links are sent there. */
export default async function SEOHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    await redirectLegacyHubTab(SEO_HUB, searchParams, SEO_SPOKE_SLUGS);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SeoHubClient />
        </Suspense>
    );
}
