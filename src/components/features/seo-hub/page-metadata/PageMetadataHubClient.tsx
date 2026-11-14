"use client";
import { FileText } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useSeoPlatform } from "@/hooks/seo_hooks/useSeoPlatform";
import { usePageMetadataOverview } from "@/hooks/seo_hooks/usePageMetadataOverview";
import { SEO_HUB } from "@/constants/hubRoutes";
import { SEO_PLATFORM_PARAM } from "@/constants/seo";
import { SeoPlatformSwitch } from "../SeoPlatformSwitch";

/** Page Metadata hub inside SEO: Pages, Products, Categories and Brands each open as a full page. */
export function PageMetadataHubClient() {
    const { platform, setPlatform, isPending } = useSeoPlatform();
    const { kpis, groups } = usePageMetadataOverview(platform);

    return (
        <UniversalHubShell
            title="Page Metadata"
            subtitle="Meta title, description and tags per page, product, category and brand."
            icon={FileText}
            groups={groups}
            kpis={kpis}
            isPending={isPending}
            parents={[{ ...SEO_HUB, href: `${SEO_HUB.href}?${SEO_PLATFORM_PARAM}=${platform}` }]}
            headerActions={<SeoPlatformSwitch platform={platform} onChange={setPlatform} />}
        />
    );
}
