import * as React from "react";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { useGeneratedSitemap } from "@/hooks/seo_hooks/useGeneratedSitemap";
import { notifySeoResult } from "@/hooks/seo_hooks/notifySeoResult";
import { SeoPlatform, SitemapSource, SitemapSourceRule } from "@/types/seo";
import { SITEMAP_SOURCES } from "@/constants/seo";
import { SitemapRuleCard } from "./SitemapRuleRow";
import { SitemapPreview } from "./SitemapPreview";
import { RobotsEditor } from "./RobotsEditor";

/**
 * System-generated sitemap (rules only, never URLs) + robots.txt, for one storefront. Mount with `key={platform}`.
 * Layout never scrolls sideways: rule cards fill a full-width row; the generated list and robots.txt share the next.
 */
export function SitemapRobotsSpoke({ platform }: { platform: SeoPlatform }) {
    const rules = useSeoConfigStore((state) => state.configs[platform].sitemap);
    const domain = useSeoConfigStore((state) => state.configs[platform].site.canonicalDomain);
    const updateSitemapRule = useSeoConfigStore((state) => state.updateSitemapRule);
    const { entries, xml, countBySource } = useGeneratedSitemap(platform);

    const saveRule = React.useCallback((source: SitemapSource, rule: SitemapSourceRule) => {
        notifySeoResult(updateSitemapRule(platform, source, rule), "Sitemap rule saved.");
    }, [platform, updateSitemapRule]);

    return (
        <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-brand-subtext/20 bg-white p-4 shadow-sm">
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-brand-text">Sitemap rules</h3>
                    <p className="text-xs text-brand-subtext">URLs are generated from the catalogue; set how each list appears.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {SITEMAP_SOURCES.map((source) => (
                        <SitemapRuleCard
                            key={`${source}-${JSON.stringify(rules[source])}`}
                            source={source}
                            rule={rules[source]}
                            urlCount={countBySource[source]}
                            onSave={(rule) => saveRule(source, rule)}
                        />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <SitemapPreview entries={entries} xml={xml} hasDomain={domain !== ""} />
                <RobotsEditor platform={platform} />
            </div>
        </div>
    );
}
