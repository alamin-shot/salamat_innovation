"use client";
import * as React from "react";
import { PackageSearch } from "lucide-react";

interface ProductsEmptyStateProps {
    title: string;
    subtitle: string;
}

/** Dashed placeholder shown when a Products table has no rows to display. */
export function ProductsEmptyState({ title, subtitle }: ProductsEmptyStateProps) {
    return (
        <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <PackageSearch className="h-8 w-8 text-brand-subtext/60" />
            <h3 className="text-sm font-bold text-brand-text">{title}</h3>
            <p className="text-xs text-brand-subtext">{subtitle}</p>
        </div>
    );
}
