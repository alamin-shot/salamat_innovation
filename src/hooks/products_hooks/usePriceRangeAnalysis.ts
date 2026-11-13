import { useMemo } from "react";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { PriceRange, PriceRangeCoverage, PriceRangeOverlap } from "@/types/products";
import { buildOverlapMap, computeScaleMax, findCoverage } from "@/utils/priceRangeRules";

// LAYER 3: Page-wide Price Range analysis, computed once and shared by the
// table rows, the coverage strip and the drawer preview.

export interface PriceRangeAnalysis {
    ranges: PriceRange[];
    /** Shared right edge (৳) of every range bar on the page. */
    scaleMax: number;
    overlapsById: Record<string, PriceRangeOverlap[]>;
    coverage: PriceRangeCoverage;
}

export function usePriceRangeAnalysis(): PriceRangeAnalysis {
    const ranges = useGlobalProductsStore((state) => state.priceRanges);

    return useMemo(() => ({
        ranges,
        scaleMax: computeScaleMax(ranges),
        overlapsById: buildOverlapMap(ranges),
        coverage: findCoverage(ranges),
    }), [ranges]);
}
