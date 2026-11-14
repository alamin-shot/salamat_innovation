import * as React from "react";

interface SeoFieldProps {
    label: string;
    hint?: string;
    children: React.ReactNode;
}

/** Labelled form row used by the SEO settings spokes. */
export function SeoField({ label, hint, children }: SeoFieldProps) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-gray-600">{label}</span>
            {children}
            {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
        </label>
    );
}

export const SEO_INPUT = "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
