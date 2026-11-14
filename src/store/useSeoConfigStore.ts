import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SeoConfigState, SeoPlatform, SeoPlatformConfig } from "@/types/seo";
import { DEFAULT_SEO_CONFIGS } from "@/constants/seo";
import { hasTitlePlaceholder, isValidCanonicalDomain, isValidPathTemplate, isValidPriority } from "@/utils/seoRules";

// LAYER 2: Per-platform SEO configuration (future /api/seo-config). Separate from page-metadata records.

const patch = (configs: Record<SeoPlatform, SeoPlatformConfig>, platform: SeoPlatform, change: Partial<SeoPlatformConfig>) => ({
    configs: { ...configs, [platform]: { ...configs[platform], ...change } },
});

export const useSeoConfigStore = create<SeoConfigState>()(
    persist(
        (set, get) => ({
            configs: { salamat: DEFAULT_SEO_CONFIGS.salamat, tekzo: DEFAULT_SEO_CONFIGS.tekzo },

            updateSiteSettings: (platform, settings) => {
                const domain = settings.canonicalDomain.trim();
                if (!isValidCanonicalDomain(domain)) return { ok: false, error: "domain_invalid" };
                if (!hasTitlePlaceholder(settings.titleTemplate)) return { ok: false, error: "title_template_invalid" };
                set(patch(get().configs, platform, { site: { ...settings, canonicalDomain: domain } }));
                return { ok: true };
            },

            updateSocialSettings: (platform, settings) => {
                if (!hasTitlePlaceholder(settings.ogTitleTemplate)) return { ok: false, error: "title_template_invalid" };
                set(patch(get().configs, platform, { social: settings }));
                return { ok: true };
            },

            updateRobotsTxt: (platform, robotsTxt) => {
                set(patch(get().configs, platform, { robotsTxt }));
                return { ok: true };
            },

            updateSitemapRule: (platform, source, rule) => {
                if (!isValidPriority(rule.priority)) return { ok: false, error: "priority_invalid" };
                if (!isValidPathTemplate(rule.pathTemplate)) return { ok: false, error: "path_template_invalid" };
                const current = get().configs[platform];
                set(patch(get().configs, platform, { sitemap: { ...current.sitemap, [source]: rule } }));
                return { ok: true };
            },
        }),
        { name: "erp-seo-config-storage-v1" }
    )
);
