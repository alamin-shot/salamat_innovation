"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useHubTab } from "@/hooks/shared_hooks/useHubTab";
import { useSeoPlatform } from "@/hooks/seo_hooks/useSeoPlatform";
import { useSeoHubOverview } from "@/hooks/seo_hooks/useSeoHubOverview";
import { SeoHubTabKey, SeoPlatform } from "@/types/seo";
import { SEO_HUB_TABS } from "@/constants/seo";
import { SharedSeoClient } from "@/components/features/seo/shared-seo/SharedSeoClient";
import { SeoPlatformSwitch } from "./SeoPlatformSwitch";
import { SiteSettingsSpoke } from "./spokes/site-settings/SiteSettingsSpoke";
import { SocialTagsSpoke } from "./spokes/social-tags/SocialTagsSpoke";
import { SitemapRobotsSpoke } from "./spokes/sitemap-robots/SitemapRobotsSpoke";

// key={platform}: switching storefront re-mounts the spoke, so a form never shows the other platform's draft.
const SPOKES: Record<SeoHubTabKey, (platform: SeoPlatform) => React.ReactNode> = {
    site_settings: (platform) => <SiteSettingsSpoke key={platform} platform={platform} />,
    page_metadata: (platform) => <SharedSeoClient key={platform} platform={platform} />,
    social_tags: (platform) => <SocialTagsSpoke key={platform} platform={platform} />,
    sitemap_robots: (platform) => <SitemapRobotsSpoke key={platform} platform={platform} />,
};

/** SEO hub: one Salamat / TEKZO switch in the header drives every spoke. */
export function SeoHubClient() {
    const hub = useHubTab<SeoHubTabKey>(SEO_HUB_TABS);
    const { platform, setPlatform, isPending } = useSeoPlatform();
    const { kpis, groups } = useSeoHubOverview(platform);

    return (
        <UniversalHubShell
            title="SEO"
            subtitle="Search appearance, social sharing, sitemap and robots for each storefront."
            icon={Search}
            groups={groups}
            kpis={kpis}
            hub={{ ...hub, isPending: hub.isPending || isPending }}
            headerActions={<SeoPlatformSwitch platform={platform} onChange={setPlatform} />}
            renderSpoke={(tab) => SPOKES[tab](platform)}
        />
    );
}
