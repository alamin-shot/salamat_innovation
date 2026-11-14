import * as React from "react";
import { Download, Map as SitemapIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SitemapEntry } from "@/types/seo";

interface SitemapPreviewProps {
    entries: SitemapEntry[];
    xml: string;
    hasDomain: boolean;
}

/** The generated sitemap: read-only (never typed by hand) and downloadable as sitemap.xml. */
export function SitemapPreview({ entries, xml, hasDomain }: SitemapPreviewProps) {
    const download = () => {
        const url = URL.createObjectURL(new Blob([xml], { type: "application/xml" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "sitemap.xml";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-bold text-brand-text">Generated sitemap ({entries.length} URLs)</h3>
                    <p className="text-xs text-brand-subtext">Built from Active products, categories and brands that are shown on the storefront.</p>
                </div>
                <Button size="sm" variant="outline" onClick={download} disabled={entries.length === 0} className="gap-1.5"><Download className="h-4 w-4" /> Download sitemap.xml</Button>
            </div>
            {!hasDomain && (
                <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-[12px] text-amber-700">URLs are relative until a canonical domain is set in Site Settings.</p>
            )}
            {entries.length === 0 ? (
                <div className="m-4 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
                    <SitemapIcon className="h-8 w-8 text-brand-subtext/60" />
                    <p className="text-sm font-bold text-brand-text">Nothing to list yet</p>
                    <p className="text-xs text-brand-subtext">Turn on a source above, or switch products / categories / brands on for the storefront.</p>
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500">
                            <tr><th className="px-4 py-2">URL</th><th className="px-4 py-2">Source</th><th className="px-4 py-2">Last modified</th><th className="px-4 py-2">Priority</th><th className="px-4 py-2">Frequency</th></tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <tr key={entry.loc} className="border-t border-gray-100">
                                    <td className="px-4 py-2 font-mono text-blue-600">{entry.loc}</td>
                                    <td className="px-4 py-2 capitalize text-gray-600">{entry.source}</td>
                                    <td className="px-4 py-2 text-gray-600">{entry.lastModified ?? "—"}</td>
                                    <td className="px-4 py-2 text-gray-600">{entry.priority.toFixed(1)}</td>
                                    <td className="px-4 py-2 text-gray-600">{entry.changeFrequency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
