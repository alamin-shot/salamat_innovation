import * as React from "react";
import { toTrackPercent } from "@/utils/priceRangeRules";

interface DualRangeSliderProps {
    /** null while the typed minimum is not a usable number. */
    minValue: number | null;
    /** null = open-ended ("and above"): only the lower handle shows. */
    maxValue: number | null;
    isOpenEnded: boolean;
    sliderMax: number;
    step: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}

// Two stacked native range inputs: keyboard and screen-reader support for free,
// with only the thumbs taking pointer events so both can be grabbed.
const THUMB_CLASSES = [
    "pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent focus:outline-none",
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-emerald-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-emerald-500/25",
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-emerald-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md",
    "[&::-moz-range-track]:bg-transparent",
].join(" ");

export function DualRangeSlider({ minValue, maxValue, isOpenEnded, sliderMax, step, onMinChange, onMaxChange }: DualRangeSliderProps) {
    const low = Math.min(minValue ?? 0, sliderMax);
    const high = isOpenEnded ? sliderMax : Math.min(Math.max(maxValue ?? sliderMax, low), sliderMax);

    const lowPercent = toTrackPercent(low, sliderMax);
    const highPercent = toTrackPercent(high, sliderMax);

    // When the handles meet near the right edge, the lower one must sit on top to stay draggable.
    const lowOnTop = low >= sliderMax - step;

    return (
        <div className="relative h-8 w-full">
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-brand-bg ring-1 ring-inset ring-brand-subtext/15" />
            <div
                className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-linear-to-r ${isOpenEnded ? "from-emerald-400 via-emerald-500 to-emerald-300" : "from-emerald-400 to-emerald-600"}`}
                style={{ left: `${lowPercent}%`, width: `${Math.max(highPercent - lowPercent, 0)}%` }}
            />

            <input
                type="range"
                aria-label="Minimum price"
                min={0}
                max={sliderMax}
                step={step}
                value={low}
                onChange={(e) => {
                    const next = Number(e.target.value);
                    onMinChange(isOpenEnded ? next : Math.min(next, high - step));
                }}
                className={`${THUMB_CLASSES} ${lowOnTop ? "z-30" : "z-20"}`}
            />
            {!isOpenEnded && (
                <input
                    type="range"
                    aria-label="Maximum price"
                    min={0}
                    max={sliderMax}
                    step={step}
                    value={high}
                    onChange={(e) => onMaxChange(Math.max(Number(e.target.value), low + step))}
                    className={`${THUMB_CLASSES} z-20`}
                />
            )}
        </div>
    );
}
