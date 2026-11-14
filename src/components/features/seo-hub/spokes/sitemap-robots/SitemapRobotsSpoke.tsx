import * as React from "react";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { useGeneratedSitemap } from "@/hooks/seo_hooks/useGeneratedSitemap";
import { notifySeoResult } from "@/hooks/seo_hooks/notifySeoResult";
import { SeoPlatform, SitemapSource, SitemapSourceRule } from "@/types/seo";
import { SITEMAP_SOURCES } from "@/constants/seo";
import { SitemapRuleRow } from "./SitemapRuleRow";
import { SitemapPreview } from "./SitemapPreview";
import { RobotsEditor } from "./RobotsEditor";

/** System-generated sitemap (rules only, never URLs) + robots.txt, for one storefront. Mount with `key={platform}`. */
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
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 p-4">
                        <h3 className="text-sm font-bold text-brand-text">Sitemap rules</h3>
                        <p className="text-xs text-brand-subtext">URLs are generated from the catalogue; set how each list appears.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left">
                            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                                <tr><th className="px-4 py-2">Source</th><th className="px-4 py-2">Include</th><th className="px-4 py-2">URL pattern</th><th className="px-4 py-2">Priority</th><th className="px-4 py-2">Frequency</th><th className="px-4 py-2" /></tr>
                            </thead>
                            <tbody>
                                {SITEMAP_SOURCES.map((source) => (
                                    <SitemapRuleRow
                                        key={`${source}-${JSON.stringify(rules[source])}`}
                                        source={source}
                                        rule={rules[source]}
                                        urlCount={countBySource[source]}
                                        onSave={(rule) => saveRule(source, rule)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <RobotsEditor platform={platform} />
            </div>
            <SitemapPreview entries={entries} xml={xml} hasDomain={domain !== ""} />
        </div>
    );
}
