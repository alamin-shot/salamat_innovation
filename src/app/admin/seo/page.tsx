import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SeoHubClient } from "@/components/features/seo-hub/SeoHubClient";

export const metadata: Metadata = {
    title: "SEO | Salamat Innovation ERP",
    description: "Site settings, page metadata, social tags, sitemap and robots.txt for Salamat and TEKZO.",
};

export default function SeoHubPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SeoHubClient />
        </Suspense>
    );
}
