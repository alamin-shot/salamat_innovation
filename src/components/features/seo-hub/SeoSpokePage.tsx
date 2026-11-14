"use client";
import * as React from "react";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useSeoPlatform } from "@/hooks/seo_hooks/useSeoPlatform";
import { useSeoHubOverview } from "@/hooks/seo_hooks/useSeoHubOverview";
import { SeoHubTabKey, SeoPlatform } from "@/types/seo";
import { SEO_HUB } from "@/constants/hubRoutes";
import { SEO_PLATFORM_PARAM } from "@/constants/seo";
import { findSpoke } from "@/utils/hubSpokes";
import { SeoPlatformSwitch } from "./SeoPlatformSwitch";
import { SiteSettingsSpoke } from "./spokes/site-settings/SiteSettingsSpoke";
import { SocialTagsSpoke } from "./spokes/social-tags/SocialTagsSpoke";
import { SitemapRobotsSpoke } from "./spokes/sitemap-robots/SitemapRobotsSpoke";

/** Page Metadata is a hub of its own (see page-metadata/), so it is not a plain spoke here. */
export type SeoPlainSpokeKey = Exclude<SeoHubTabKey, "page_metadata">;

// key={platform}: switching storefront re-mounts the spoke, so a form never shows the other platform's draft.
const SPOKES: Record<SeoPlainSpokeKey, (platform: SeoPlatform) => React.ReactNode> = {
    site_settings: (platform) => <SiteSettingsSpoke key={platform} platform={platform} />,
    social_tags: (platform) => <SocialTagsSpoke key={platform} platform={platform} />,
    sitemap_robots: (platform) => <SitemapRobotsSpoke key={platform} platform={platform} />,
};

/** Full-page SEO spoke; the platform switch stays in the header and "Back to SEO" keeps the platform. */
export function SeoSpokePage({ spoke }: { spoke: SeoPlainSpokeKey }) {
    const { platform, setPlatform, isPending } = useSeoPlatform();
    const meta = findSpoke(useSeoHubOverview(platform).groups, spoke);
    const hub = { ...SEO_HUB, href: `${SEO_HUB.href}?${SEO_PLATFORM_PARAM}=${platform}` };

    return (
        <HubSpokePage hub={hub} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone} actions={<SeoPlatformSwitch platform={platform} onChange={setPlatform} />}>
            <div className={`transition-opacity duration-200 ${isPending ? "pointer-events-none opacity-60" : "opacity-100"}`}>
                {SPOKES[spoke](platform)}
            </div>
        </HubSpokePage>
    );
}
