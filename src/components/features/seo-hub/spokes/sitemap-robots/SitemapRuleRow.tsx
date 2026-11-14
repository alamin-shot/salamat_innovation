import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { StatusToggle } from "@/components/features/products-pages/shared/StatusToggle";
import { SitemapChangeFrequency, SitemapSource, SitemapSourceRule } from "@/types/seo";
import { SITEMAP_CHANGE_FREQUENCIES } from "@/constants/seo";
import { SEO_INPUT } from "../../shared/SeoField";

interface SitemapRuleRowProps {
    source: SitemapSource;
    rule: SitemapSourceRule;
    urlCount: number;
    onSave: (rule: SitemapSourceRule) => void;
}

const LABELS: Record<SitemapSource, string> = { products: "Products", categories: "Categories", brands: "Brands" };
const isFrequency = (value: string): value is SitemapChangeFrequency => SITEMAP_CHANGE_FREQUENCIES.some((option) => option === value);

/** How one catalogue list enters the sitemap: include, URL pattern, priority, change frequency. */
export const SitemapRuleRow = React.memo(function SitemapRuleRow({ source, rule, urlCount, onSave }: SitemapRuleRowProps) {
    const [draft, setDraft] = React.useState(rule);
    const [priorityText, setPriorityText] = React.useState(String(rule.priority));
    const isDirty = draft.include !== rule.include || draft.pathTemplate !== rule.pathTemplate || draft.changeFrequency !== rule.changeFrequency || priorityText !== String(rule.priority);

    return (
        <tr className="border-b border-gray-100 last:border-0">
            <td className="px-4 py-3">
                <p className="text-[13px] font-semibold text-gray-800">{LABELS[source]}</p>
                <p className="text-[11px] text-gray-500">{urlCount} URL{urlCount === 1 ? "" : "s"}</p>
            </td>
            <td className="px-4 py-3">
                <StatusToggle checked={draft.include} onChange={() => setDraft((prev) => ({ ...prev, include: !prev.include }))} label={draft.include ? "Included" : "Excluded"} />
            </td>
            <td className="px-4 py-3">
                <input className={`${SEO_INPUT} font-mono text-[12px]`} value={draft.pathTemplate} onChange={(e) => setDraft((prev) => ({ ...prev, pathTemplate: e.target.value }))} />
            </td>
            <td className="px-4 py-3 w-28">
                <input type="number" min="0" max="1" step="0.1" className={SEO_INPUT} value={priorityText} onChange={(e) => setPriorityText(e.target.value)} />
            </td>
            <td className="px-4 py-3 w-40">
                <CustomSelect value={draft.changeFrequency} options={[...SITEMAP_CHANGE_FREQUENCIES]} onChange={(value) => { if (isFrequency(value)) setDraft((prev) => ({ ...prev, changeFrequency: value })); }} />
            </td>
            <td className="px-4 py-3 text-right">
                <Button size="sm" variant="success" disabled={!isDirty} onClick={() => onSave({ ...draft, priority: Number(priorityText) })} className="gap-1.5 disabled:opacity-50">
                    <Save className="h-3.5 w-3.5" /> Save
                </Button>
            </td>
        </tr>
    );
});

SitemapRuleRow.displayName = "SitemapRuleRow";
