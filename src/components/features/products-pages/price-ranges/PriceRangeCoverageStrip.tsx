import * as React from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, Store } from "lucide-react";
import { PriceRangeAnalysis } from "@/hooks/products_hooks/usePriceRangeAnalysis";
import { PriceRangeOverlap } from "@/types/products";
import { formatPriceBound, formatPriceSpan } from "@/utils/priceRangeRules";
import { spanStyle } from "./VisualRangeBar";

interface PriceRangeCoverageStripProps {
    analysis: PriceRangeAnalysis;
}

const SEGMENT_TONES = ["from-emerald-400 to-emerald-500", "from-teal-400 to-teal-500"];

interface OverlapPair extends PriceRangeOverlap {
    otherId: string;
    otherLabel: string;
}

/** One track showing every Active range end to end, with gaps and overlaps marked. */
export function PriceRangeCoverageStrip({ analysis }: PriceRangeCoverageStripProps) {
    const { ranges, scaleMax, overlapsById, coverage } = analysis;

    const activeRanges = React.useMemo(
        () => ranges.filter((range) => range.status === "Active").sort((a, b) => a.minPrice - b.minPrice),
        [ranges]
    );

    // Each clash is listed once, not once per side.
    const overlapPairs = React.useMemo(() => {
        const seen = new Set<string>();
        const pairs: OverlapPair[] = [];
        activeRanges.forEach((range) => {
            (overlapsById[range.id] ?? []).forEach((overlap) => {
                const key = [range.id, overlap.rangeId].sort().join("|");
                if (!seen.has(key)) {
                    seen.add(key);
                    pairs.push({ ...overlap, otherId: range.id, otherLabel: range.label });
                }
            });
        });
        return pairs;
    }, [activeRanges, overlapsById]);

    const gapSpans = React.useMemo(() => {
        const spans: { from: number; to: number | null }[] = coverage.gaps.map((gap) => ({ from: gap.from, to: gap.to }));
        if (coverage.uncoveredFrom !== null) {
            spans.push({ from: coverage.uncoveredFrom, to: null });
        }
        return spans;
    }, [coverage]);

    if (activeRanges.length === 0) {
        return null;
    }

    const isClean = gapSpans.length === 0 && overlapPairs.length === 0;

    return (
        <div className="flex flex-col gap-3 border-b border-brand-subtext/20 bg-brand-bg/30 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-brand-subtext" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-subtext">Storefront Coverage</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="rounded-full border border-brand-subtext/20 bg-white px-2 py-0.5 text-brand-text">
                        {activeRanges.length} active {activeRanges.length === 1 ? "range" : "ranges"}
                    </span>
                    {isClean ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Every price covered, no overlaps
                        </span>
                    ) : (
                        <>
                            {gapSpans.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-700">
                                    <CircleDashed className="h-3 w-3" /> {gapSpans.length} {gapSpans.length === 1 ? "gap" : "gaps"}
                                </span>
                            )}
                            {overlapPairs.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700">
                                    <AlertTriangle className="h-3 w-3" /> {overlapPairs.length} {overlapPairs.length === 1 ? "overlap" : "overlaps"}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-white ring-1 ring-inset ring-brand-subtext/15">
                    {gapSpans.map((gap) => (
                        <span
                            key={`gap-${gap.from}`}
                            className="absolute inset-y-0.5 rounded-full border border-dashed border-rose-300 bg-rose-50"
                            style={spanStyle(gap.from, gap.to, scaleMax)}
                            title={`Not covered: ${formatPriceSpan(gap.from, gap.to)}`}
                        />
                    ))}
                    {activeRanges.map((range, index) => (
                        <span
                            key={range.id}
                            className={`absolute inset-y-0 flex items-center justify-start overflow-hidden border-x border-white bg-linear-to-r ${SEGMENT_TONES[index % SEGMENT_TONES.length]}`}
                            style={spanStyle(range.minPrice, range.maxPrice, scaleMax)}
                            title={`${range.label}: ${formatPriceSpan(range.minPrice, range.maxPrice)}`}
                        >
                            <span className="truncate px-2 text-[10px] font-bold text-white">{range.label}</span>
                        </span>
                    ))}
                    {overlapPairs.map((pair) => (
                        <span
                            key={`overlap-${pair.otherId}-${pair.rangeId}`}
                            className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,#f59e0b_0px,#f59e0b_3px,transparent_3px,transparent_6px)] ring-1 ring-inset ring-amber-500/60"
                            style={spanStyle(pair.from, pair.to, scaleMax)}
                            title={`"${pair.otherLabel}" and "${pair.label}" overlap: ${formatPriceSpan(pair.from, pair.to)}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-medium text-brand-subtext tabular-nums">
                    <span>{formatPriceBound(0)}</span>
                    <span>{formatPriceBound(scaleMax)}</span>
                </div>
            </div>

            {!isClean && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                    {gapSpans.map((gap) => (
                        <span key={`gap-text-${gap.from}`} className="inline-flex items-center gap-1.5 text-rose-700">
                            <CircleDashed className="h-3.5 w-3.5" />
                            Not covered: <span className="font-semibold tabular-nums">{formatPriceSpan(gap.from, gap.to)}</span>
                        </span>
                    ))}
                    {overlapPairs.map((pair) => (
                        <span key={`overlap-text-${pair.otherId}-${pair.rangeId}`} className="inline-flex items-center gap-1.5 text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {pair.otherLabel} &amp; {pair.label}: <span className="font-semibold tabular-nums">{formatPriceSpan(pair.from, pair.to)}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
