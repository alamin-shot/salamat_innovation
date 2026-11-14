import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { SeoSpokePage } from "@/components/features/seo-hub/SeoSpokePage";

export const metadata: Metadata = {
    title: "Site Settings · SEO | Salamat Innovation ERP",
};

/** Full-page SEO spoke (back link to the SEO hub inside). */
export default function SiteSettingsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <SeoSpokePage spoke="site_settings" />
        </Suspense>
    );
}
