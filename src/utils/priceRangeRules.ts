import {
    PriceRange,
    PriceRangeBounds,
    PriceRangeCoverage,
    PriceRangeDraft,
    PriceRangeGap,
    PriceRangeOverlap,
    PriceRangeValidation,
} from "@/types/products";
import { PRICE_RANGE_OPEN_END_HEADROOM, PRICE_RANGE_SCALE_STEP } from "@/constants/products";
import { parsePriceInput } from "@/utils/productRules";

// LAYER 3: Pure Price Range rules. No React, no store.
// Edge rule (client decision): ranges may touch. 0–500 and 500–1000 do not overlap;
// only a shared stretch wider than zero counts. Only Active ranges reach the
// storefront, so only they take part in overlap and gap checks.

/** Upper end as a number; open-ended ranges run to Infinity. */
const upperOf = (range: PriceRangeBounds): number => range.maxPrice ?? Infinity;

const isActive = (range: PriceRange): boolean => range.status === "Active";

/** The shared stretch of two ranges, or null when they only touch or are apart. */
export function sharedSpan(a: PriceRangeBounds, b: PriceRangeBounds): { from: number; to: number | null } | null {
    const from = Math.max(a.minPrice, b.minPrice);
    const to = Math.min(upperOf(a), upperOf(b));
    if (to <= from) {
        return null;
    }
    return { from, to: Number.isFinite(to) ? to : null };
}

/**
 * Active ranges (other than `excludeId`) that overlap `candidate`.
 * The candidate's own status is not checked, so the drawer can warn before activation.
 */
export function findOverlaps(candidate: PriceRangeBounds, ranges: PriceRange[], excludeId?: string): PriceRangeOverlap[] {
    const overlaps: PriceRangeOverlap[] = [];
    ranges.forEach((range) => {
        if (range.id === excludeId || !isActive(range)) {
            return;
        }
        const span = sharedSpan(candidate, range);
        if (span) {
            overlaps.push({ rangeId: range.id, label: range.label, from: span.from, to: span.to });
        }
    });
    return overlaps.sort((a, b) => a.from - b.from);
}

/** Overlaps for every Active range, keyed by range id. Inactive ranges map to []. */
export function buildOverlapMap(ranges: PriceRange[]): Record<string, PriceRangeOverlap[]> {
    const map: Record<string, PriceRangeOverlap[]> = {};
    ranges.forEach((range) => {
        map[range.id] = isActive(range) ? findOverlaps(range, ranges, range.id) : [];
    });
    return map;
}

/** Every price stretch from ৳0 upward that no Active range covers. */
export function findCoverage(ranges: PriceRange[]): PriceRangeCoverage {
    const active = ranges.filter(isActive).sort((a, b) => a.minPrice - b.minPrice);
    const gaps: PriceRangeGap[] = [];
    let coveredTo = 0;

    for (const range of active) {
        if (range.minPrice > coveredTo) {
            gaps.push({ from: coveredTo, to: range.minPrice });
        }
        coveredTo = Math.max(coveredTo, upperOf(range));
        if (!Number.isFinite(coveredTo)) {
            return { gaps, uncoveredFrom: null };
        }
    }
    return { gaps, uncoveredFrom: coveredTo };
}

/**
 * Right edge of the shared bar scale: the highest finite bound across all ranges,
 * plus headroom past any open-ended start, rounded up to PRICE_RANGE_SCALE_STEP.
 */
export function computeScaleMax(ranges: PriceRangeBounds[]): number {
    let highest = 0;
    ranges.forEach((range) => {
        const reach = range.maxPrice ?? range.minPrice * (1 + PRICE_RANGE_OPEN_END_HEADROOM);
        highest = Math.max(highest, reach, range.minPrice);
    });
    const rounded = Math.ceil(highest / PRICE_RANGE_SCALE_STEP) * PRICE_RANGE_SCALE_STEP;
    return Math.max(rounded, PRICE_RANGE_SCALE_STEP);
}

/** Position of a price on a 0 → scaleMax track, clamped to 0–100. */
export function toTrackPercent(value: number, scaleMax: number): number {
    if (scaleMax <= 0) {
        return 0;
    }
    return Math.min(100, Math.max(0, (value / scaleMax) * 100));
}

/** "৳ 15,000" with en-IN digit grouping, no decimals. */
export function formatPriceBound(amount: number): string {
    return `৳ ${amount.toLocaleString("en-IN")}`;
}

/** "৳ 0 – ৳ 15,000" or "৳ 80,000 & above". */
export function formatPriceSpan(minPrice: number, maxPrice: number | null): string {
    if (maxPrice === null) {
        return `${formatPriceBound(minPrice)} & above`;
    }
    return `${formatPriceBound(minPrice)} – ${formatPriceBound(maxPrice)}`;
}

const isWholeAmount = (value: number | null): value is number =>
    value !== null && Number.isInteger(value) && value >= 0;

/** Bounds from the draft for live previews; null while either number is unusable. */
export function draftBounds(draft: PriceRangeDraft): PriceRangeBounds | null {
    const minPrice = parsePriceInput(draft.minText);
    if (!isWholeAmount(minPrice)) {
        return null;
    }
    if (draft.isOpenEnded) {
        return { minPrice, maxPrice: null };
    }
    const maxPrice = parsePriceInput(draft.maxText);
    if (!isWholeAmount(maxPrice) || maxPrice <= minPrice) {
        return null;
    }
    return { minPrice, maxPrice };
}

/** Validates the drawer form. Overlaps are not errors; they only warn. */
export function validatePriceRange(draft: PriceRangeDraft): PriceRangeValidation {
    const label = draft.label.trim();
    if (!label) {
        return { ok: false, error: "label_required" };
    }
    const minPrice = parsePriceInput(draft.minText);
    if (!isWholeAmount(minPrice)) {
        return { ok: false, error: "min_invalid" };
    }
    if (draft.isOpenEnded) {
        return { ok: true, value: { label, minPrice, maxPrice: null } };
    }
    const maxPrice = parsePriceInput(draft.maxText);
    if (!isWholeAmount(maxPrice)) {
        return { ok: false, error: "max_invalid" };
    }
    if (maxPrice <= minPrice) {
        return { ok: false, error: "max_not_above_min" };
    }
    return { ok: true, value: { label, minPrice, maxPrice } };
}
