import * as React from "react";

interface SearchSnippetPreviewProps {
    domain: string;
    title: string;
    description: string;
}

/** Approximate Google result for the homepage, so admins see the effect of their settings. */
export function SearchSnippetPreview({ domain, title, description }: SearchSnippetPreviewProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Search result preview</p>
            <p className="truncate text-[12px] text-gray-600">{domain || "https://your-domain"}</p>
            <p className="truncate text-[17px] leading-snug text-[#1a0dab]">{title || "Page title"}</p>
            <p className="line-clamp-2 text-[13px] text-gray-600">{description || "Default meta description appears here when a page has none of its own."}</p>
        </div>
    );
}
