import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSeoConfigStore } from "@/store/useSeoConfigStore";
import { SeoPlatform } from "@/types/seo";
import { notifySeoResult } from "@/hooks/seo_hooks/notifySeoResult";
import { SEO_PLATFORM_LABELS } from "@/constants/seo";
import { SEO_INPUT } from "../../shared/SeoField";

/** robots.txt for one storefront. The sitemap line is appended automatically when a domain is set. */
export function RobotsEditor({ platform }: { platform: SeoPlatform }) {
    const saved = useSeoConfigStore((state) => state.configs[platform].robotsTxt);
    const domain = useSeoConfigStore((state) => state.configs[platform].site.canonicalDomain);
    const updateRobotsTxt = useSeoConfigStore((state) => state.updateRobotsTxt);
    const [draft, setDraft] = React.useState(saved);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-brand-subtext/20 bg-white p-5 shadow-sm">
            <div>
                <h3 className="text-sm font-bold text-brand-text">robots.txt</h3>
                <p className="text-xs text-brand-subtext">Tells search engines which paths they may crawl.</p>
            </div>
            <textarea rows={8} spellCheck={false} className={`${SEO_INPUT} font-mono text-[12px] resize-y`} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <p className="rounded-md bg-gray-50 px-3 py-2 font-mono text-[11px] text-gray-500">
                {domain ? `Sitemap: ${domain}/sitemap.xml` : "Sitemap line is added once a canonical domain is set in Site Settings."}
            </p>
            <div className="flex justify-end">
                <Button variant="success" size="sm" onClick={() => notifySeoResult(updateRobotsTxt(platform, draft), `${SEO_PLATFORM_LABELS[platform]} robots.txt saved.`)} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save robots.txt
                </Button>
            </div>
        </div>
    );
}
