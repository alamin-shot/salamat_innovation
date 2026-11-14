import { SitemapCatalogItem, SitemapEntry, SitemapSource, SitemapSourceRule } from "@/types/seo";

// Pure SEO rules: validation and the system-generated sitemap.

/** "Galaxy S25 Ultra (12/512)" → "galaxy-s25-ultra-12-512". */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Empty is allowed (not configured yet); otherwise https origin only, no path or trailing slash. */
export function isValidCanonicalDomain(domain: string): boolean {
    if (domain === "") return true;
    try {
        const url = new URL(domain);
        return url.protocol === "https:" && url.pathname === "/" && !domain.endsWith("/") && !url.search && !url.hash;
    } catch {
        return false;
    }
}

export const isValidPriority = (priority: number): boolean => Number.isFinite(priority) && priority >= 0 && priority <= 1;

export const isValidPathTemplate = (template: string): boolean => template.startsWith("/") && template.includes("{slug}");

export const hasTitlePlaceholder = (template: string): boolean => template.includes("%s");

/** "05-10-2026" (the Products audit format) → "2026-10-05"; anything else → null. */
export function ddmmyyyyToIso(date: string | null): string | null {
    const match = date?.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

/**
 * Sitemap entries for one catalogue list. Duplicate slugs keep the first record,
 * since two URLs cannot share one address.
 */
export function buildSitemapEntries(domain: string, source: SitemapSource, rule: SitemapSourceRule, items: { label: string; item: SitemapCatalogItem }[]): SitemapEntry[] {
    if (!rule.include) return [];
    const seen = new Set<string>();
    const entries: SitemapEntry[] = [];
    for (const { label, item } of items) {
        const slug = item.slug?.trim() || slugify(item.name);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        entries.push({
            loc: `${domain}${rule.pathTemplate.replace("{slug}", slug)}`,
            source,
            label,
            lastModified: item.lastModified,
            priority: rule.priority,
            changeFrequency: rule.changeFrequency,
        });
    }
    return entries;
}

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** sitemaps.org XML for download / preview. */
export function toSitemapXml(entries: SitemapEntry[]): string {
    const urls = entries.map((entry) => [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastModified ? `    <lastmod>${entry.lastModified}</lastmod>` : null,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        "  </url>",
    ].filter((line): line is string => line !== null).join("\n"));
    return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, "</urlset>"].join("\n");
}
