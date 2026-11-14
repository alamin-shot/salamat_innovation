import { CalendarPlus, CircleCheck, CircleSlash, Clock, Users, XCircle, type LucideIcon } from "lucide-react";
import { PartnerMetrics } from "@/types/partners";
import { PARTNER_TIERS } from "@/constants/partners";
import { PartnerTierBadge } from "./PartnerBits";

/** Counts for the open partner list. */
export function PartnerMetricsStrip({ metrics, isApplications, totalLabel }: { metrics: PartnerMetrics; isApplications: boolean; totalLabel: string }) {
    const cards: { label: string; value: number; icon: LucideIcon; tone: string }[] = isApplications
        ? [
            { label: totalLabel, value: metrics.total, icon: Users, tone: "text-gray-700 bg-gray-50" },
            { label: "Pending", value: metrics.pending, icon: Clock, tone: "text-amber-600 bg-amber-50" },
            { label: "Rejected", value: metrics.rejected, icon: XCircle, tone: "text-rose-600 bg-rose-50" },
            { label: "New This Month", value: metrics.newThisMonth, icon: CalendarPlus, tone: "text-blue-600 bg-blue-50" },
        ]
        : [
            { label: totalLabel, value: metrics.total, icon: Users, tone: "text-gray-700 bg-gray-50" },
            { label: "Active", value: metrics.active, icon: CircleCheck, tone: "text-emerald-600 bg-emerald-50" },
            { label: "Inactive", value: metrics.inactive, icon: CircleSlash, tone: "text-gray-500 bg-gray-100" },
            { label: "New This Month", value: metrics.newThisMonth, icon: CalendarPlus, tone: "text-blue-600 bg-blue-50" },
        ];

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.tone}`}><card.icon className="h-5 w-5" /></div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500">{card.label}</span>
                            <span className="block text-xl font-bold tabular-nums text-gray-900">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>
            {!isApplications && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">By tier</span>
                    {PARTNER_TIERS.map((tier) => (
                        <span key={tier} className="flex items-center gap-1.5 text-sm">
                            <PartnerTierBadge tier={tier} />
                            <b className="tabular-nums text-gray-800">{metrics.byTier[tier]}</b>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
