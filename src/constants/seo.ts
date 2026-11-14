import { SeoConfigError, SeoPlatform, SeoPlatformConfig, SitemapChangeFrequency, SitemapSource } from "@/types/seo";

export const SEO_PLATFORMS = ["salamat", "tekzo"] as const satisfies readonly SeoPlatform[];

export const SEO_PLATFORM_LABELS: Readonly<Record<SeoPlatform, string>> = {
    salamat: "Salamat",
    tekzo: "TEKZO",
};

/** URL param that carries the hub-wide platform switch (survives tab changes). */
export const SEO_PLATFORM_PARAM = "platform";

export const SITEMAP_SOURCES = ["products", "categories", "brands"] as const satisfies readonly SitemapSource[];

export const SITEMAP_CHANGE_FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const satisfies readonly SitemapChangeFrequency[];

const DEFAULT_ROBOTS = ["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /cart", "Disallow: /checkout"].join("\n");

const defaultConfig = (siteName: string): SeoPlatformConfig => ({
    site: {
        siteName,
        // Left empty on purpose: set the real storefront domain in Site Settings.
        canonicalDomain: "",
        titleTemplate: `%s | ${siteName}`,
        defaultMetaDescription: "",
        googleVerificationCode: "",
    },
    social: { ogImage: null, ogTitleTemplate: `%s | ${siteName}`, twitterHandle: "" },
    robotsTxt: DEFAULT_ROBOTS,
    sitemap: {
        products: { include: true, pathTemplate: "/product/{slug}", priority: 0.8, changeFrequency: "daily" },
        categories: { include: true, pathTemplate: "/category/{slug}", priority: 0.7, changeFrequency: "weekly" },
        brands: { include: true, pathTemplate: "/brand/{slug}", priority: 0.6, changeFrequency: "weekly" },
    },
});

export const DEFAULT_SEO_CONFIGS: Readonly<Record<SeoPlatform, SeoPlatformConfig>> = {
    salamat: defaultConfig("Salamat Innovation"),
    tekzo: defaultConfig("TEKZO"),
};

export const SEO_CONFIG_ERROR_MESSAGES: Readonly<Record<SeoConfigError, string>> = {
    domain_invalid: "Canonical domain must be a full https:// address without a path, e.g. https://example.com.",
    priority_invalid: "Priority must be between 0.0 and 1.0.",
    path_template_invalid: "Path must start with / and contain {slug}.",
    title_template_invalid: "Title template must contain %s where the page title goes.",
};
