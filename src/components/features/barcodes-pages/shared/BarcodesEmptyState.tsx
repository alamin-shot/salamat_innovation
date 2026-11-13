import * as React from "react";
import { ScanBarcode } from "lucide-react";

interface BarcodesEmptyStateProps {
    title: string;
    subtitle: string;
}

/** Dashed placeholder shown when a Barcodes table has no rows to display. */
export function BarcodesEmptyState({ title, subtitle }: BarcodesEmptyStateProps) {
    return (
        <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <ScanBarcode className="h-8 w-8 text-brand-subtext/60" />
            <h3 className="text-sm font-bold text-brand-text">{title}</h3>
            <p className="text-xs text-brand-subtext">{subtitle}</p>
        </div>
    );
}
