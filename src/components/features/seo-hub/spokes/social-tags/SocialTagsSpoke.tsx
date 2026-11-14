import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { SeoPlatform, SeoSocialSettings } from "@/types/seo";
import { notifySeoResult } from "@/hooks/seo_hooks/notifySeoResult";
import { SEO_PLATFORM_LABELS } from "@/constants/seo";
import { isHttpUrl } from "@/utils/urlRules";
import { SeoField, SEO_INPUT } from "../../shared/SeoField";
import { SocialCardPreview } from "./SocialCardPreview";

/** OpenGraph / X defaults for one storefront. Mount with `key={platform}`. */
export function SocialTagsSpoke({ platform }: { platform: SeoPlatform }) {
    const saved = useSeoConfigStore((state) => state.configs[platform].social);
    const domain = useSeoConfigStore((state) => state.configs[platform].site.canonicalDomain);
    const updateSocialSettings = useSeoConfigStore((state) => state.updateSocialSettings);
    const [draft, setDraft] = React.useState<SeoSocialSettings>(saved);
    const set = (changes: Partial<SeoSocialSettings>) => setDraft((prev) => ({ ...prev, ...changes }));

    const imageText = draft.ogImage ?? "";
    const imageInvalid = imageText !== "" && !isHttpUrl(imageText);

    const save = () => {
        if (imageInvalid) return;
        notifySeoResult(updateSocialSettings(platform, draft), `${SEO_PLATFORM_LABELS[platform]} social tags saved.`);
    };

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-5 rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm">
                <SeoField label="Default Share Image (og:image)" hint={imageInvalid ? "Must be a full http(s) image URL." : "1200 × 630 px works best on Facebook and X."}>
                    <input className={`${SEO_INPUT} ${imageInvalid ? "border-rose-300" : ""}`} value={imageText} placeholder="https://…/share.jpg" onChange={(e) => set({ ogImage: e.target.value.trim() || null })} />
                </SeoField>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <SeoField label="Share Title Template (og:title)" hint="%s is replaced by each page's title.">
                        <input className={SEO_INPUT} value={draft.ogTitleTemplate} onChange={(e) => set({ ogTitleTemplate: e.target.value })} />
                    </SeoField>
                    <SeoField label="X / Twitter Handle" hint="Shown as twitter:site, e.g. @tekzo">
                        <input className={SEO_INPUT} value={draft.twitterHandle} placeholder="@handle" onChange={(e) => set({ twitterHandle: e.target.value.trim() })} />
                    </SeoField>
                </div>
                <div className="flex justify-end border-t border-gray-100 pt-4">
                    <Button variant="success" onClick={save} disabled={imageInvalid} className="gap-2 px-6"><Save className="h-4 w-4" /> Save Social Tags</Button>
                </div>
            </div>
            <SocialCardPreview image={imageInvalid ? null : draft.ogImage} title={draft.ogTitleTemplate.replace("%s", "Home")} domain={domain} handle={draft.twitterHandle} />
        </div>
    );
}
