import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { SeoPlatform, SeoSiteSettings } from "@/types/seo";
import { notifySeoResult } from "@/hooks/seo_hooks/notifySeoResult";
import { SEO_PLATFORM_LABELS } from "@/constants/seo";
import { SeoField, SEO_INPUT } from "../../shared/SeoField";
import { SearchSnippetPreview } from "./SearchSnippetPreview";

/** Site-wide SEO for one storefront. Mount with `key={platform}` so the draft follows the header switch. */
export function SiteSettingsSpoke({ platform }: { platform: SeoPlatform }) {
    const saved = useSeoConfigStore((state) => state.configs[platform].site);
    const updateSiteSettings = useSeoConfigStore((state) => state.updateSiteSettings);
    const [draft, setDraft] = React.useState<SeoSiteSettings>(saved);
    const set = (changes: Partial<SeoSiteSettings>) => setDraft((prev) => ({ ...prev, ...changes }));

    const save = () => notifySeoResult(updateSiteSettings(platform, draft), `${SEO_PLATFORM_LABELS[platform]} site settings saved.`);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-5 rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <SeoField label="Site Name">
                        <input className={SEO_INPUT} value={draft.siteName} onChange={(e) => set({ siteName: e.target.value })} />
                    </SeoField>
                    <SeoField label="Canonical Domain" hint="https:// address without a path; prefixes every sitemap URL.">
                        <input className={SEO_INPUT} value={draft.canonicalDomain} placeholder="https://example.com" onChange={(e) => set({ canonicalDomain: e.target.value })} />
                    </SeoField>
                    <SeoField label="Title Template" hint="%s is replaced by each page's title.">
                        <input className={SEO_INPUT} value={draft.titleTemplate} onChange={(e) => set({ titleTemplate: e.target.value })} />
                    </SeoField>
                    <SeoField label="Google Verification Code" hint="Content of the google-site-verification meta tag.">
                        <input className={SEO_INPUT} value={draft.googleVerificationCode} onChange={(e) => set({ googleVerificationCode: e.target.value })} />
                    </SeoField>
                </div>
                <SeoField label="Default Meta Description" hint={`${draft.defaultMetaDescription.length} / 160 characters recommended`}>
                    <textarea rows={3} className={`${SEO_INPUT} resize-none`} value={draft.defaultMetaDescription} onChange={(e) => set({ defaultMetaDescription: e.target.value })} />
                </SeoField>
                <div className="flex justify-end border-t border-gray-100 pt-4">
                    <Button variant="success" onClick={save} className="gap-2 px-6"><Save className="h-4 w-4" /> Save Site Settings</Button>
                </div>
            </div>
            <SearchSnippetPreview
                domain={draft.canonicalDomain}
                title={draft.titleTemplate.replace("%s", "Home")}
                description={draft.defaultMetaDescription}
            />
        </div>
    );
}
