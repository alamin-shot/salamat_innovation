"use client";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useSeoPlatform } from "@/hooks/seo_hooks/useSeoPlatform";
import { usePageMetadataOverview } from "@/hooks/seo_hooks/usePageMetadataOverview";
import { SeoTabType } from "@/types/seo";
import { PAGE_METADATA_HUB, SEO_HUB } from "@/constants/hubRoutes";
import { SEO_PLATFORM_PARAM } from "@/constants/seo";
import { findSpoke } from "@/utils/hubSpokes";
import { SharedSeoClient } from "@/components/features/seo/shared-seo/SharedSeoClient";
import { SeoPlatformSwitch } from "../SeoPlatformSwitch";

/** Full page for one Page Metadata section; back goes to the Page Metadata hub (platform kept). */
export function PageMetadataSectionPage({ section }: { section: SeoTabType }) {
    const { platform, setPlatform, isPending } = useSeoPlatform();
    const meta = findSpoke(usePageMetadataOverview(platform).groups, section);
    const query = `?${SEO_PLATFORM_PARAM}=${platform}`;

    return (
        <HubSpokePage
            hub={{ ...PAGE_METADATA_HUB, href: `${PAGE_METADATA_HUB.href}${query}` }}
            parents={[{ ...SEO_HUB, href: `${SEO_HUB.href}${query}` }]}
            label={meta.label}
            description={meta.description}
            icon={meta.icon}
            tone={meta.tone}
            actions={<SeoPlatformSwitch platform={platform} onChange={setPlatform} />}
        >
            <div className={`transition-opacity duration-200 ${isPending ? "pointer-events-none opacity-60" : "opacity-100"}`}>
                <SharedSeoClient key={platform} platform={platform} section={section} />
            </div>
        </HubSpokePage>
    );
}
