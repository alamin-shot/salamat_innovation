import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { PageMetadataHubClient } from "@/components/features/seo-hub/page-metadata/PageMetadataHubClient";
import { PAGE_METADATA_SECTION_SLUGS } from "@/constants/hubRoutes";
import { PageSearchParams, redirectToHub } from "@/utils/hubRedirect";

export const metadata: Metadata = {
    title: "Page Metadata · SEO | Salamat Innovation ERP",
    description: "Meta title, description and tags per page, product, category and brand.",
};

/** Page Metadata hub (inside SEO). Old ?section= links open that section's full page. */
export default async function PageMetadataHubPage({ searchParams }: { searchParams: PageSearchParams }) {
    const section = (await searchParams).section;
    const slug = Object.entries(PAGE_METADATA_SECTION_SLUGS).find(([key]) => key === section)?.[1];
    if (slug) await redirectToHub(`/admin/seo/page-metadata/${slug}`, searchParams, {}, ["section"]);
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <PageMetadataHubClient />
        </Suspense>
    );
}
