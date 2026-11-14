import * as React from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Barcode,
    ClipboardCheck,
    CreditCard,
    History,
    PackagePlus,
    Receipt,
    ShoppingCart,
    Undo2,
    UserPlus,
    type LucideIcon,
} from "lucide-react";
import { LifecycleEvent, LifecycleKind, PersonLifecycle } from "@/types/personLifecycle";
import { formatAbsolute, formatRelative } from "@/utils/dateDisplay";

const money = (value: number) => `৳${Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const KIND_ICON: Record<LifecycleKind, LucideIcon> = {
    account_created: UserPlus,
    order_confirmation: ClipboardCheck,
    storefront_order: ShoppingCart,
    order_payment: CreditCard,
    sale: Receipt,
    sale_payment: CreditCard,
    sale_return: Undo2,
    unit_sold: Barcode,
    payment_received: ArrowDownLeft,
    purchase: PackagePlus,
    purchase_payment: CreditCard,
    purchase_return: Undo2,
    unit_received: Barcode,
    payment_sent: ArrowUpRight,
};

/** Rose = the balance grew, emerald = it shrank, grey = informational. */
const toneOf = (delta: number) =>
    delta > 0 ? "bg-rose-50 text-rose-600" : delta < 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500";

const dueLabel = (due: number) => (due < 0 ? `${money(due)} advance` : `${money(due)} due`);

const LifecycleEventRow = React.memo(function LifecycleEventRow({ event }: { event: LifecycleEvent }) {
    const Icon = KIND_ICON[event.kind];
    return (
        <li className="flex items-start gap-3 px-4 py-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneOf(event.dueDelta)}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-xs font-bold text-gray-800">{event.title}</span>
                    {event.reference && <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">{event.reference}</span>}
                </div>
                <span className="truncate text-[11px] text-gray-500">{event.detail}</span>
                <span className="text-[10px] text-gray-400" title={formatAbsolute(event.at)} suppressHydrationWarning>{formatRelative(event.at)}</span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                {event.amount !== null && <span className="text-xs font-bold text-gray-800">{money(event.amount)}</span>}
                {event.dueDelta !== 0 && (
                    <span className={`text-[10px] font-semibold ${event.dueDelta > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {event.dueDelta > 0 ? "+" : "−"}{money(event.dueDelta)}
                    </span>
                )}
                <span className="text-[10px] text-gray-400">{dueLabel(event.dueAfter)}</span>
            </div>
        </li>
    );
});
LifecycleEventRow.displayName = "LifecycleEventRow";

/** The person's journey across the ERP, newest first, with the running due after each event. */
export function PersonLifecycleTimeline({ lifecycle }: { lifecycle: PersonLifecycle | null }) {
    if (!lifecycle || lifecycle.events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                <History className="h-8 w-8 text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">No lifecycle events yet</h3>
                <p className="text-xs text-gray-500">Orders, sales, purchases, returns and payments will appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-indigo-50/40 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                <History className="h-3.5 w-3.5" /> Lifecycle · {lifecycle.events.length} events
            </div>
            <ul className="divide-y divide-gray-100">
                {lifecycle.events.map((event) => <LifecycleEventRow key={event.id} event={event} />)}
            </ul>
        </div>
    );
}
