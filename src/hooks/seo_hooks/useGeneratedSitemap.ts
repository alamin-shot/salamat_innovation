import { useMemo } from "react";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { useSeoStore } from "@/store/useSeoStore";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { SeoPlatform, SitemapCatalogItem, SitemapEntry, SitemapSource, SitemapSourceRecord } from "@/types/seo";
import { SITEMAP_SOURCES } from "@/constants/seo";
import { buildSitemapEntries, ddmmyyyyToIso, toSitemapXml } from "@/utils/seoRules";

/**
 * System-generated sitemap for one platform. A record is listed when it is Active and shown on the
 * storefront (ecommerce on). Its slug comes from the matching SEO page-metadata record when one exists,
 * otherwise from its name. Admins only edit the per-source rules, never the URLs.
 */
export function useGeneratedSitemap(platform: SeoPlatform): { entries: SitemapEntry[]; xml: string; countBySource: Record<SitemapSource, number> } {
    const products = useGlobalProductsStore((state) => state.products);
    const categories = useGlobalProductsStore((state) => state.categories);
    const brands = useGlobalProductsStore((state) => state.brands);
    const seoRecords = useSeoStore((state) => state.records);
    const config = useSeoConfigStore((state) => state.configs[platform]);

    return useMemo(() => {
        const slugFor = (source: SitemapSource, name: string): string | null => {
            const key = name.trim().toLowerCase();
            const record = seoRecords.find((item) => item.platform === platform && item.type === source && item.status === "Active" && item.name.trim().toLowerCase() === key);
            return record?.slug ?? null;
        };
        const toItems = (source: SitemapSource, rows: SitemapSourceRecord[]): { label: string; item: SitemapCatalogItem }[] => rows
            .filter((row) => row.status === "Active" && row.ecommerce)
            .map((row) => ({
                label: row.name,
                item: { name: row.name, slug: slugFor(source, row.name), lastModified: ddmmyyyyToIso(row.updatedAt ?? row.createdAt) },
            }));

        const lists: Record<SitemapSource, SitemapSourceRecord[]> = { products, categories, brands };
        const domain = config.site.canonicalDomain;
        const entries = SITEMAP_SOURCES.flatMap((source) => buildSitemapEntries(domain, source, config.sitemap[source], toItems(source, lists[source])));
        const countBySource = Object.fromEntries(SITEMAP_SOURCES.map((source) => [source, entries.filter((entry) => entry.source === source).length])) as Record<SitemapSource, number>;

        return { entries, xml: toSitemapXml(entries), countBySource };
    }, [products, categories, brands, seoRecords, config, platform]);
}
