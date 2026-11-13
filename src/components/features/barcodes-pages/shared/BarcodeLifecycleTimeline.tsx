import * as React from "react";
import { ArrowRightLeft, Barcode as BarcodeIcon, PackageCheck, PencilLine, Printer, ShoppingCart } from "lucide-react";
import { BarcodeEvent, BarcodeEventType, BarcodeFieldChange, BarcodeJourneyEntry } from "@/types/barcodes";
import { BARCODE_FIELD_LABELS, BARCODE_STATUS_DOTS } from "@/constants/barcodes";
import { formatBarcodeDateTime, formatBarcodeMoney } from "@/utils/barcodeRules";
import { BarcodeStatusBadge } from "./BarcodeStatusBadge";

interface BarcodeLifecycleTimelineProps {
    entries: BarcodeJourneyEntry[];
}

const EVENT_ICONS: Record<BarcodeEventType, React.ComponentType<{ className?: string }>> = {
    Generated: BarcodeIcon,
    Printed: Printer,
    Received: PackageCheck,
    Transferred: ArrowRightLeft,
    Sold: ShoppingCart,
};

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <span className="text-xs text-brand-subtext">
            {label}: <span className="font-semibold text-brand-text">{value}</span>
        </span>
    );
}

function EventBody({ event }: { event: BarcodeEvent }) {
    switch (event.type) {
        case "Generated":
            return <Detail label="Generated at" value={event.location} />;
        case "Printed":
            return <Detail label="Printed at" value={event.location} />;
        case "Received":
            return (
                <>
                    <Detail label="Supplier" value={event.supplier.name} />
                    <Detail label="Received at" value={event.location} />
                    {event.price !== null && <Detail label="Buy" value={formatBarcodeMoney(event.price)} />}
                </>
            );
        case "Transferred":
            return (
                <>
                    <Detail label="Moved" value={`${event.fromLocation} → ${event.location}`} />
                    <Detail
                        label="Hand-to-hand"
                        value={event.receivedBy ? `${event.handedOverBy.name} → ${event.receivedBy.name}` : event.handedOverBy.name}
                    />
                </>
            );
        case "Sold":
            return (
                <>
                    <Detail label="Customer" value={event.customer.name} />
                    <Detail label="Sold at" value={event.location} />
                    {event.price !== null && <Detail label="Sale" value={formatBarcodeMoney(event.price)} />}
                </>
            );
    }
}

/** "Field Changed: MRP | Old: 500 -> New: 450 | By: Admin" */
function ChangeBody({ change }: { change: BarcodeFieldChange }) {
    return (
        <span className="text-xs text-brand-subtext">
            Field Changed: <span className="font-semibold text-brand-text">{BARCODE_FIELD_LABELS[change.field]}</span>
            {" | "}Old: <span className="font-semibold text-rose-600">{change.oldValue ?? "—"}</span>
            {" -> "}New: <span className="font-semibold text-emerald-600">{change.newValue ?? "—"}</span>
            {" | "}By: <span className="font-semibold text-brand-text">{change.changedBy}</span>
        </span>
    );
}

/** Vertical journey stepper: lifecycle events and field edits, oldest first. */
export const BarcodeLifecycleTimeline = React.memo(function BarcodeLifecycleTimeline({ entries }: BarcodeLifecycleTimelineProps) {
    if (entries.length === 0) {
        return (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <h3 className="text-sm font-bold text-brand-text">No journey recorded</h3>
                <p className="text-xs text-brand-subtext">Lifecycle events will appear here.</p>
            </div>
        );
    }

    return (
        <ol className="relative flex flex-col">
            {entries.map((entry, index) => {
                const isLast = index === entries.length - 1;
                const Icon = entry.kind === "event" ? EVENT_ICONS[entry.event.type] : PencilLine;
                const dot = entry.kind === "event" ? BARCODE_STATUS_DOTS[entry.event.type] : "bg-brand-subtext";

                return (
                    <li key={entry.id} className="relative flex gap-4 pb-5 last:pb-0">
                        {!isLast && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-brand-subtext/20" aria-hidden="true" />}
                        <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${dot}`}>
                            <Icon className="h-4 w-4" />
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg border border-brand-subtext/15 bg-brand-bg/30 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {entry.kind === "event" ? (
                                    <BarcodeStatusBadge status={entry.event.type} />
                                ) : (
                                    <span className="inline-flex w-max items-center rounded-full border border-brand-subtext/20 bg-white px-2.5 py-0.5 text-[11px] font-bold text-brand-subtext">
                                        Edited
                                    </span>
                                )}
                                <span className="text-[11px] text-brand-subtext">{formatBarcodeDateTime(entry.timestamp)}</span>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                {entry.kind === "event" ? <EventBody event={entry.event} /> : <ChangeBody change={entry.change} />}
                            </div>

                            {entry.kind === "event" && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-0.5">
                                    <span className="text-[11px] text-brand-subtext">By: <span className="font-medium text-brand-text">{entry.event.createdBy}</span></span>
                                    {entry.event.reference && <span className="text-[11px] font-mono text-brand-subtext">{entry.event.reference}</span>}
                                    {entry.event.note && <span className="text-[11px] italic text-brand-subtext">{entry.event.note}</span>}
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
});

BarcodeLifecycleTimeline.displayName = "BarcodeLifecycleTimeline";
