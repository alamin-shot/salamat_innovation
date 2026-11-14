// LAYER 1: SEO hub. Two independent resources:
//   • Page metadata records (useSeoStore, future /api/seo-records), moved here unchanged.
//   • Per-platform configuration (useSeoConfigStore, future /api/seo-config):
//     site settings, social/OpenGraph defaults, robots.txt and sitemap rules.

/** The storefront an SEO view edits. The hub header switch sets it for every spoke. */
export type SeoPlatform = "salamat" | "tekzo";

export type SeoHubTabKey = "site_settings" | "page_metadata" | "social_tags" | "sitemap_robots";

// ── Page metadata (existing records) ───────────────────────────────────────
export type SeoTabType = "pages" | "products" | "categories" | "brands";

export interface SeoRecord {
    id: string;
    platform: SeoPlatform;
    type: SeoTabType;
    name: string;
    slug: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaTags: string;
    status: "Active" | "Inactive";
    productCategory?: string;
    productBrand?: string;
    createdAt: string;
}

// ── Per-platform configuration ─────────────────────────────────────────────
export interface SeoSiteSettings {
    siteName: string;
    /** https://example.com — no trailing slash. Prefix of every sitemap URL. */
    canonicalDomain: string;
    /** "%s" is replaced by the page title, e.g. "%s | TEKZO". */
    titleTemplate: string;
    defaultMetaDescription: string;
    googleVerificationCode: string;
}

export interface SeoSocialSettings {
    /** Default share image (og:image); null = none. */
    ogImage: string | null;
    /** "%s" is replaced by the page title. */
    ogTitleTemplate: string;
    /** "@tekzo"; empty = not set. */
    twitterHandle: string;
}

/** Catalogue lists the sitemap is generated from. */
export type SitemapSource = "products" | "categories" | "brands";

export type SitemapChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

/** How one catalogue list appears in the sitemap. Admins set rules, never type URLs. */
export interface SitemapSourceRule {
    include: boolean;
    /** Storefront path with "{slug}", e.g. "/product/{slug}". */
    pathTemplate: string;
    /** 0.0 – 1.0 */
    priority: number;
    changeFrequency: SitemapChangeFrequency;
}

export interface SeoPlatformConfig {
    site: SeoSiteSettings;
    social: SeoSocialSettings;
    robotsTxt: string;
    sitemap: Record<SitemapSource, SitemapSourceRule>;
}

/** One generated sitemap URL. */
export interface SitemapEntry {
    loc: string;
    source: SitemapSource;
    /** The record's display name, for the admin preview. */
    label: string;
    /** YYYY-MM-DD; null when the record has no date. */
    lastModified: string | null;
    priority: number;
    changeFrequency: SitemapChangeFrequency;
}

/** A catalogue record as the sitemap generator needs it (decoupled from the Products store shape). */
export interface SitemapCatalogItem {
    name: string;
    /** From an SEO page-metadata record when one exists; otherwise derived from the name. */
    slug: string | null;
    /** YYYY-MM-DD or null. */
    lastModified: string | null;
}

/** The fields the sitemap reads from a Product, Category or Brand. */
export interface SitemapSourceRecord {
    name: string;
    status: string;
    ecommerce: boolean;
    /** DD-MM-YYYY (Products audit format) or null. */
    updatedAt: string | null;
    createdAt: string;
}

export type SeoConfigError = "domain_invalid" | "priority_invalid" | "path_template_invalid" | "title_template_invalid";

export type SeoConfigResult = { ok: true } | { ok: false; error: SeoConfigError };

export interface SeoConfigState {
    configs: Record<SeoPlatform, SeoPlatformConfig>;
    updateSiteSettings: (platform: SeoPlatform, settings: SeoSiteSettings) => SeoConfigResult;
    updateSocialSettings: (platform: SeoPlatform, settings: SeoSocialSettings) => SeoConfigResult;
    updateRobotsTxt: (platform: SeoPlatform, robotsTxt: string) => SeoConfigResult;
    updateSitemapRule: (platform: SeoPlatform, source: SitemapSource, rule: SitemapSourceRule) => SeoConfigResult;
}
