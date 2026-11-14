import * as React from "react";
import { FolderTree, Package, Save, Tag, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { StatusToggle } from "@/components/features/products-pages/shared/StatusToggle";
import { SitemapChangeFrequency, SitemapSource, SitemapSourceRule } from "@/types/seo";
import { SITEMAP_CHANGE_FREQUENCIES } from "@/constants/seo";
import { SEO_INPUT } from "../../shared/SeoField";

interface SitemapRuleCardProps {
    source: SitemapSource;
    rule: SitemapSourceRule;
    urlCount: number;
    onSave: (rule: SitemapSourceRule) => void;
}

const LABELS: Record<SitemapSource, string> = { products: "Products", categories: "Categories", brands: "Brands" };
const ICONS: Record<SitemapSource, LucideIcon> = { products: Package, categories: FolderTree, brands: Tag };
const isFrequency = (value: string): value is SitemapChangeFrequency => SITEMAP_CHANGE_FREQUENCIES.some((option) => option === value);
const FIELD_LABEL = "text-[11px] font-semibold uppercase tracking-wider text-gray-500";

/**
 * How one catalogue list enters the sitemap: include, URL pattern, priority, change frequency.
 * A card (not a table row), so every field gets full width and nothing scrolls sideways.
 */
export const SitemapRuleCard = React.memo(function SitemapRuleCard({ source, rule, urlCount, onSave }: SitemapRuleCardProps) {
    const [draft, setDraft] = React.useState(rule);
    const [priorityText, setPriorityText] = React.useState(String(rule.priority));
    const isDirty = draft.include !== rule.include || draft.pathTemplate !== rule.pathTemplate || draft.changeFrequency !== rule.changeFrequency || priorityText !== String(rule.priority);
    const Icon = ICONS[source];

    return (
        <div className={`flex flex-col gap-4 rounded-xl border p-4 transition-colors ${draft.include ? "border-gray-200 bg-white" : "border-dashed border-gray-200 bg-gray-50/60"}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${draft.include ? "border-teal-100 bg-teal-50 text-teal-600" : "border-gray-200 bg-white text-gray-400"}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{LABELS[source]}</p>
                        <p className="text-[11px] text-gray-500">{urlCount} URL{urlCount === 1 ? "" : "s"} in the sitemap</p>
                    </div>
                </div>
                <StatusToggle checked={draft.include} onChange={() => setDraft((prev) => ({ ...prev, include: !prev.include }))} label={draft.include ? "Included" : "Excluded"} />
            </div>

            <fieldset disabled={!draft.include} className={`flex flex-col gap-3 ${draft.include ? "" : "opacity-60"}`}>
                <label className="flex flex-col gap-1.5">
                    <span className={FIELD_LABEL}>URL pattern</span>
                    <input className={`${SEO_INPUT} font-mono text-[12px]`} value={draft.pathTemplate} onChange={(e) => setDraft((prev) => ({ ...prev, pathTemplate: e.target.value }))} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1.5">
                        <span className={FIELD_LABEL}>Priority</span>
                        <input type="number" min="0" max="1" step="0.1" className={SEO_INPUT} value={priorityText} onChange={(e) => setPriorityText(e.target.value)} />
                    </label>
                    <div className="flex flex-col gap-1.5">
                        <span className={FIELD_LABEL}>Frequency</span>
                        <CustomSelect value={draft.changeFrequency} options={[...SITEMAP_CHANGE_FREQUENCIES]} onChange={(value) => { if (isFrequency(value)) setDraft((prev) => ({ ...prev, changeFrequency: value })); }} disabled={!draft.include} />
                    </div>
                </div>
            </fieldset>

            <div className="mt-auto flex justify-end border-t border-gray-100 pt-3">
                <Button size="sm" variant="success" disabled={!isDirty} onClick={() => onSave({ ...draft, priority: Number(priorityText) })} className="gap-1.5 disabled:opacity-50">
                    <Save className="h-3.5 w-3.5" /> {isDirty ? "Save changes" : "Saved"}
                </Button>
            </div>
        </div>
    );
});

SitemapRuleCard.displayName = "SitemapRuleCard";
