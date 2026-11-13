import * as React from "react";
import { SectionPageShellProps } from "@/types/layout";

// Page frame for the Products and Barcodes list pages.
//
// Scroll contract: AdminLayout's <main> is the ONLY vertical scroll container.
// The frame is at least as tall as <main> (so short tables still fill the screen)
// and grows with its content. It must never be locked to the screen height
// (h-full + overflow-hidden): that squeezes the table into a small inner box,
// hides rows, and buries the table's sideways scrollbar under its last row.
// Tables only scroll sideways, inside their own wrapper.
export function SectionPageShell({ header, isPending = false, cardClassName = "", children }: SectionPageShellProps) {
    return (
        <div className="flex min-h-full w-full flex-col p-4">
            {header}

            <div className={`flex-1 rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"} ${cardClassName}`}>
                {children}
            </div>
        </div>
    );
}
