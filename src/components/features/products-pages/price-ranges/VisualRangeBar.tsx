import * as React from "react";
import { ChevronsRight } from "lucide-react";
import { PriceRangeBounds, PriceRangeOverlap } from "@/types/products";
import { formatPriceBound, formatPriceSpan, toTrackPercent } from "@/utils/priceRangeRules";

interface VisualRangeBarProps {
    minPrice: number;
    maxPrice: number | null;
    /** Shared right edge (৳) so every bar on the page lines up. */
    scaleMax: number;
    isActive: boolean;
    /** Stretches shared with other Active ranges, drawn as amber stripes. */
    overlaps?: PriceRangeOverlap[];
    /** Other Active ranges, drawn faintly behind for context. */
    ghosts?: PriceRangeBounds[];
    size?: "sm" | "lg";
    /** Scale labels under the track (drawer preview). */
    showAxis?: boolean;
}

const AXIS_STOPS = [0, 25, 50, 75, 100];
/** Thinnest a segment is drawn (in %), so tiny ranges stay visible. */
const MIN_SEGMENT_PERCENT = 1.5;

/** Left offset and width (in %) of a price span on the track. */
export function spanStyle(from: number, to: number | null, scaleMax: number): React.CSSProperties {
    const left = toTrackPercent(from, scaleMax);
    const right = to === null ? 100 : toTrackPercent(to, scaleMax);
    const width = Math.max(right - left, MIN_SEGMENT_PERCENT);
    return { left: `${Math.min(left, 100 - width)}%`, width: `${width}%` };
}

/** Mini horizontal bar showing where a price range sits on the catalogue's price scale. */
export const VisualRangeBar = React.memo(function VisualRangeBar({
    minPrice, maxPrice, scaleMax, isActive, overlaps = [], ghosts = [], size = "sm", showAxis = false,
}: VisualRangeBarProps) {
    const isOpenEnded = maxPrice === null;
    const trackHeight = size === "lg" ? "h-4" : "h-2.5";

    const segmentTone = isActive
        ? isOpenEnded
            ? "from-emerald-400 via-emerald-500 to-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_2px_6px_-1px_rgba(16,185,129,0.45)]"
            : "from-emerald-400 to-emerald-600 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_2px_6px_-1px_rgba(16,185,129,0.45)]"
        : "from-slate-300 to-slate-400";

    return (
        <div className="flex w-full flex-col gap-1.5">
            <div className={`relative ${trackHeight} w-full overflow-hidden rounded-full bg-brand-bg ring-1 ring-inset ring-brand-subtext/10`}>
                {/* Quarter ticks */}
                {AXIS_STOPS.slice(1, -1).map((stop) => (
                    <span key={stop} className="absolute inset-y-0 w-px bg-brand-subtext/15" style={{ left: `${stop}%` }} />
                ))}

                {/* Neighbouring ranges, for context */}
                {ghosts.map((ghost, index) => (
                    <span
                        key={`${ghost.minPrice}-${ghost.maxPrice ?? "open"}-${index}`}
                        className="absolute inset-y-0 rounded-full bg-brand-subtext/15"
                        style={spanStyle(ghost.minPrice, ghost.maxPrice, scaleMax)}
                    />
                ))}

                {/* This range */}
                <span
                    className={`absolute inset-y-0 flex items-center justify-end rounded-full bg-linear-to-r transition-all duration-300 ${segmentTone}`}
                    style={spanStyle(minPrice, maxPrice, scaleMax)}
                    title={formatPriceSpan(minPrice, maxPrice)}
                >
                    {isOpenEnded && size === "lg" && <ChevronsRight className="mr-1 h-3 w-3 text-white" />}
                </span>

                {/* Clashes with other Active ranges */}
                {overlaps.map((overlap) => (
                    <span
                        key={overlap.rangeId}
                        className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,#f59e0b_0px,#f59e0b_3px,transparent_3px,transparent_6px)] ring-1 ring-inset ring-amber-500/60"
                        style={spanStyle(overlap.from, overlap.to, scaleMax)}
                        title={`Overlaps "${overlap.label}": ${formatPriceSpan(overlap.from, overlap.to)}`}
                    />
                ))}
            </div>

            {showAxis && (
                <div className="relative h-4 w-full text-[10px] font-medium text-brand-subtext tabular-nums">
                    {AXIS_STOPS.map((stop) => (
                        <span
                            key={stop}
                            className={`absolute top-0 whitespace-nowrap ${stop === 0 ? "" : stop === 100 ? "-translate-x-full" : "-translate-x-1/2"}`}
                            style={{ left: `${stop}%` }}
                        >
                            {formatPriceBound(Math.round((scaleMax * stop) / 100))}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
});

VisualRangeBar.displayName = "VisualRangeBar";
