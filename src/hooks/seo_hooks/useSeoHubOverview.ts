import { useMemo } from "react";
import { FileText, Globe, Map as SitemapIcon, Share2 } from "lucide-react";
import { useSeoStore } from "@/store/useSeoStore";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { SeoHubTabKey, SeoPlatform } from "@/types/seo";
import { useGeneratedSitemap } from "./useGeneratedSitemap";

/** KPI strip + portal cards for the SEO hub, for the platform chosen in the header switch. */
export function useSeoHubOverview(platform: SeoPlatform): { kpis: HubKpi[]; groups: HubSpokeGroup<SeoHubTabKey>[] } {
    const records = useSeoStore((state) => state.records);
    const config = useSeoConfigStore((state) => state.configs[platform]);
    const sitemap = useGeneratedSitemap(platform);

    return useMemo(() => {
        const platformRecords = records.filter((record) => record.platform === platform);
        const activeRecords = platformRecords.filter((record) => record.status === "Active").length;
        const socialReady = [config.social.ogImage, config.social.twitterHandle].filter(Boolean).length;
        const domainSet = config.site.canonicalDomain !== "";

        const kpis: HubKpi[] = [
            { id: "domain", label: "Canonical Domain", value: domainSet ? config.site.canonicalDomain.replace(/^https:\/\//, "") : "Not set", hint: domainSet ? "Used in every sitemap URL" : "Set it in Site Settings", icon: Globe, tone: domainSet ? "emerald" : "amber" },
            { id: "meta", label: "Page Metadata", value: String(platformRecords.length), hint: `${activeRecords} active records`, icon: FileText, tone: "blue" },
            { id: "sitemap", label: "Sitemap URLs", value: String(sitemap.entries.length), hint: `${sitemap.countBySource.products} products · ${sitemap.countBySource.categories} categories · ${sitemap.countBySource.brands} brands`, icon: SitemapIcon, tone: "teal" },
            { id: "social", label: "Social Defaults", value: `${socialReady} / 2`, hint: "Share image and X / Twitter handle", icon: Share2, tone: socialReady === 2 ? "emerald" : "amber" },
        ];

        const groups: HubSpokeGroup<SeoHubTabKey>[] = [
            {
                title: "Search Appearance",
                description: "How the storefront appears in Google results.",
                spokes: [
                    { id: "site_settings", label: "Site Settings", description: "Site name, canonical domain, title template and verification", icon: Globe, tone: "emerald" },
                    { id: "page_metadata", label: "Page Metadata", description: "Meta title, description and tags per page, product, category and brand", icon: FileText, tone: "blue", count: platformRecords.length },
                ],
            },
            {
                title: "Sharing & Crawling",
                description: "Social previews and what search engines may crawl.",
                spokes: [
                    { id: "social_tags", label: "Social Tags", description: "OpenGraph and X / Twitter defaults for shared links", icon: Share2, tone: "violet" },
                    { id: "sitemap_robots", label: "Sitemap & Robots", description: "System-generated sitemap and robots.txt", icon: SitemapIcon, tone: "teal", count: sitemap.entries.length },
                ],
            },
        ];

        return { kpis, groups };
    }, [records, config, sitemap, platform]);
}
