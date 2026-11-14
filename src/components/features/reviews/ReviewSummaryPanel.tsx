import { BadgeCheck } from "lucide-react";
import { ReviewSummary } from "@/types/reviews";
import { StarRating } from "./StarRating";

/** Average rating, 5→1 distribution bars and status counts, above the reviews table. */
export function ReviewSummaryPanel({ summary }: { summary: ReviewSummary }) {
    return (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-[200px_1fr_220px]">
            <div className="flex flex-col items-center justify-center gap-1 border-gray-100 md:border-r md:pr-4">
                <span className="text-4xl font-black tabular-nums text-gray-900">{summary.average.toFixed(1)}</span>
                <StarRating rating={summary.average} size="lg" />
                <span className="text-xs text-gray-500">{summary.total} review{summary.total === 1 ? "" : "s"}</span>
            </div>

            <div className="flex flex-col justify-center gap-1.5">
                {summary.distribution.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-12 shrink-0 font-semibold text-gray-600">{row.stars} star</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${row.percent}%` }} />
                        </div>
                        <span className="w-14 shrink-0 text-right tabular-nums text-gray-500">{row.count} · {row.percent}%</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col justify-center gap-2 border-gray-100 text-sm md:border-l md:pl-4">
                <div className="flex justify-between"><span className="text-gray-500">Pending</span><span className="rounded-full bg-amber-50 px-2 font-bold text-amber-600">{summary.byStatus.Pending}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Approved</span><span className="rounded-full bg-green-50 px-2 font-bold text-green-600">{summary.byStatus.Approved}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Rejected</span><span className="rounded-full bg-red-50 px-2 font-bold text-red-500">{summary.byStatus.Rejected}</span></div>
                <div className="flex justify-between border-t border-gray-100 pt-2"><span className="flex items-center gap-1 text-gray-500"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Verified buyers</span><span className="font-bold text-emerald-700">{summary.verified}</span></div>
            </div>
        </div>
    );
}
