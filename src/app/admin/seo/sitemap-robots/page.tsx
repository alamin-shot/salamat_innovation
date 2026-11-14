import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SeoSpokePage } from "@/components/features/seo-hub/SeoSpokePage";

export const metadata: Metadata = {
    title: "Sitemap & Robots · SEO | Salamat Innovation ERP",
};

/** Full-page SEO spoke (back link to the SEO hub inside). */
export default function SitemapRobotsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SeoSpokePage spoke="sitemap_robots" />
        </Suspense>
    );
}
