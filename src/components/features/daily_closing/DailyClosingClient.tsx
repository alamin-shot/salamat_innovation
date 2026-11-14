"use client"

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Lock, Unlock } from "lucide-react";
import { useClosingManager } from "@/hooks/daily_closing_hooks/useClosingManager";
import { getHubCategories } from "@/hooks/daily_closing_hooks/closingHubFactory";
import { ClosingSpokeKey, DAILY_CLOSING_HUB } from "@/constants/hubRoutes";
import { HubTone } from "@/types/hub";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { DatePicker } from "@/components/ui/DatePicker";
import { ClosingHubPortal } from "./components/ClosingHubPortal";
import { ClosingSpokeView } from "./components/ClosingSpokeView";
import { ClosingDenominationDrawer } from "./drawers/ClosingDenominationDrawer";
import { ClosingDetailDrawer } from "./drawers/ClosingDetailDrawer";
import { ClosingEditDrawer } from "./drawers/ClosingEditDrawer";
import { DailyBankDrawer } from "./drawers/DailyBankDrawer";
import { MasterZReportPrint } from "./print/MasterZReportPrint";

type ClosingManager = ReturnType<typeof useClosingManager>;

function DayStatusBadge({ manager }: { manager: ClosingManager }) {
    if (manager.isLocked) return <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700"><Lock className="h-3 w-3" /> Locked</span>;
    if (manager.isSubmitted) return <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700"><Lock className="h-3 w-3" /> Submitted</span>;
    return <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500"><Unlock className="h-3 w-3" /> Open</span>;
}

/** The closing items carry colour classes ("text-indigo-600 …"); the page frame wants the tone name. */
const toneOf = (color: string): HubTone => {
    const match = color.match(/text-(\w+)-600/)?.[1];
    const tones: HubTone[] = ["emerald", "amber", "rose", "blue", "indigo", "violet", "teal", "cyan", "sky", "fuchsia", "orange", "slate"];
    return tones.find((tone) => tone === match) ?? "slate";
};

/**
 * Daily Closing. Without `spoke` it is the hub (date context + portal cards); with `spoke` it is that
 * spoke's full page (/admin/daily-closing/<slug>) with "Back to Daily Closing". Both keep ?date=.
 */
export function DailyClosingClient({ spoke }: { spoke?: ClosingSpokeKey }) {
    const manager = useClosingManager(spoke);
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `EOD_ZReport_${manager.activeDate}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } }"
    });

    const datePicker = (
        <div className="w-full md:w-48 shrink-0">
            <DatePicker label="Master Closing Date" value={manager.activeDate} onChange={(val) => manager.handleRouteChange("date", val)} />
        </div>
    );

    const drawers = (
        <>
            <DailyBankDrawer manager={manager} />
            <ClosingEditDrawer manager={manager} />
            <ClosingDenominationDrawer manager={manager} />
            <ClosingDetailDrawer manager={manager} />
            <MasterZReportPrint ref={printRef} manager={manager} />
        </>
    );

    if (spoke) {
        const item = getHubCategories({}).flatMap((category) => category.items).find((candidate) => candidate.id === spoke);
        const hub = { ...DAILY_CLOSING_HUB, href: `${DAILY_CLOSING_HUB.href}?date=${manager.activeDate}` };
        return (
            <HubSpokePage
                hub={hub}
                label={item?.label ?? "Daily Closing"}
                description={item?.desc ?? ""}
                icon={item?.icon ?? Lock}
                tone={item ? toneOf(item.color) : "slate"}
                actions={<div className="flex items-end gap-3"><DayStatusBadge manager={manager} />{datePicker}</div>}
            >
                <div className={`transition-opacity duration-200 ${manager.isPending ? "pointer-events-none opacity-50" : "opacity-100"}`}>
                    <ClosingSpokeView manager={manager} onPrint={handlePrint} />
                </div>
                {drawers}
            </HubSpokePage>
        );
    }

    return (
        <div className="flex min-h-full w-full flex-col gap-4 bg-gray-50/50 p-3 sm:p-4">
            {/* Closing date context (drives every card's count and is carried into each spoke) */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900">
                        Daily Closing Operations
                        <DayStatusBadge manager={manager} />
                    </h1>
                    <p className="mt-1 text-xs text-gray-500">Select a closing date to load reconciliation context.</p>
                </div>
                {datePicker}
            </div>

            <div className={`transition-opacity duration-200 ${manager.isPending ? "pointer-events-none opacity-50" : "opacity-100"}`}>
                <ClosingHubPortal manager={manager} />
            </div>
            {drawers}
        </div>
    );
}
