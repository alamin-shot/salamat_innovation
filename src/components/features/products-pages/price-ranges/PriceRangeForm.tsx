import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { PriceRange, PriceRangeBounds, PriceRangeDraft, PriceRangeInput } from "@/types/products";
import { PRICE_RANGE_ERROR_MESSAGES, PRICE_RANGE_SLIDER_STEP } from "@/constants/products";
import { parsePriceInput, toPriceInput } from "@/utils/productRules";
import { computeScaleMax, draftBounds, findOverlaps, formatPriceSpan, validatePriceRange } from "@/utils/priceRangeRules";
import { AuditFooter } from "../shared/AuditCells";
import { StatusToggle } from "../shared/StatusToggle";
import { VisualRangeBar } from "./VisualRangeBar";
import { DualRangeSlider } from "./DualRangeSlider";
import { PriceRangeOverlapBanner } from "./PriceRangeOverlapBanner";

interface PriceRangeFormProps {
    record: PriceRange | null;
    /** Every saved range, for the overlap check and the context bars. */
    ranges: PriceRange[];
    onSubmit: (input: PriceRangeInput) => void;
    onCancel: () => void;
}

const FIELD_LABEL = "text-xs font-bold text-brand-subtext uppercase tracking-wider";
const FIELD_INPUT = "w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-brand-bg disabled:text-brand-subtext";

const toWhole = (text: string): number | null => {
    const value = parsePriceInput(text);
    return value !== null && Number.isInteger(value) && value >= 0 ? value : null;
};

export function PriceRangeForm({ record, ranges, onSubmit, onCancel }: PriceRangeFormProps) {
    const [draft, setDraft] = React.useState<PriceRangeDraft>({
        label: record?.label ?? "",
        minText: toPriceInput(record?.minPrice ?? null),
        maxText: toPriceInput(record?.maxPrice ?? null),
        isOpenEnded: record ? record.maxPrice === null : false,
    });

    const update = (changes: Partial<PriceRangeDraft>) => setDraft((prev) => ({ ...prev, ...changes }));

    const others = React.useMemo(() => ranges.filter((range) => range.id !== record?.id), [ranges, record?.id]);
    const ghosts = React.useMemo<PriceRangeBounds[]>(
        () => others.filter((range) => range.status === "Active").map((range) => ({ minPrice: range.minPrice, maxPrice: range.maxPrice })),
        [others]
    );

    const minValue = toWhole(draft.minText);
    const maxValue = draft.isOpenEnded ? null : toWhole(draft.maxText);
    const bounds = draftBounds(draft);

    // Scale is fixed by the saved ranges and only grows for typed values past it,
    // so dragging a handle to the end never moves the end.
    const baseScale = React.useMemo(() => computeScaleMax(record ? [...others, record] : others), [others, record]);
    const typedReach = Math.max(minValue ?? 0, maxValue ?? 0);
    const sliderMax = Math.max(baseScale, computeScaleMax([{ minPrice: typedReach, maxPrice: typedReach }]));

    // A handful of ranges: cheap enough to run on every keystroke.
    const overlaps = bounds ? findOverlaps(bounds, ranges, record?.id) : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = validatePriceRange(draft);
        if (!result.ok) {
            toast.error(PRICE_RANGE_ERROR_MESSAGES[result.error]);
            return;
        }
        onSubmit({
            ...result.value,
            status: record?.status ?? "Active",
            productCount: record?.productCount ?? 0,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-32">
            <div className="flex flex-col gap-1.5">
                <label className={FIELD_LABEL}>
                    Range Label <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={draft.label}
                    onChange={(e) => update({ label: e.target.value })}
                    placeholder="e.g. Budget Friendly"
                    className={FIELD_INPUT}
                />
                <p className="text-xs text-brand-subtext">Shoppers see this name on the storefront price filter.</p>
            </div>

            <div className="flex flex-col gap-5 rounded-xl border border-brand-subtext/20 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-bold text-brand-text">Price Bounds</h3>
                        <p className="text-xs text-brand-subtext">Drag the handles or type exact amounts in taka. Ranges may share an edge.</p>
                    </div>
                    <StatusToggle
                        checked={draft.isOpenEnded}
                        onChange={() => update({ isOpenEnded: !draft.isOpenEnded })}
                        label="No upper limit (& above)"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className={FIELD_LABEL}>
                            Minimum Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-subtext">৳</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step={1}
                                required
                                value={draft.minText}
                                onChange={(e) => update({ minText: e.target.value })}
                                placeholder="0"
                                className={`${FIELD_INPUT} pl-7 tabular-nums`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={FIELD_LABEL}>
                            Maximum Price {!draft.isOpenEnded && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-subtext">৳</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step={1}
                                required={!draft.isOpenEnded}
                                disabled={draft.isOpenEnded}
                                value={draft.isOpenEnded ? "" : draft.maxText}
                                onChange={(e) => update({ maxText: e.target.value })}
                                placeholder={draft.isOpenEnded ? "& above" : "15000"}
                                className={`${FIELD_INPUT} pl-7 tabular-nums`}
                            />
                        </div>
                    </div>
                </div>

                <DualRangeSlider
                    minValue={minValue}
                    maxValue={maxValue}
                    isOpenEnded={draft.isOpenEnded}
                    sliderMax={sliderMax}
                    step={PRICE_RANGE_SLIDER_STEP}
                    onMinChange={(value) => update({ minText: String(value) })}
                    onMaxChange={(value) => update({ maxText: String(value) })}
                />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-brand-subtext/20 bg-brand-bg/30 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-bold text-brand-text">Live Preview</h3>
                        <p className="text-xs text-brand-subtext">Where this range sits among the other active ranges.</p>
                    </div>
                    {bounds && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 tabular-nums">
                            {formatPriceSpan(bounds.minPrice, bounds.maxPrice)}
                        </span>
                    )}
                </div>

                {bounds ? (
                    <VisualRangeBar
                        minPrice={bounds.minPrice}
                        maxPrice={bounds.maxPrice}
                        scaleMax={sliderMax}
                        isActive
                        overlaps={overlaps}
                        ghosts={ghosts}
                        size="lg"
                        showAxis
                    />
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-brand-subtext/20 p-4 text-center text-xs text-brand-subtext">
                        Enter a minimum and a higher maximum (whole taka) to preview the range.
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-brand-subtext">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600" /> This range</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-brand-subtext/20" /> Other active ranges</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-[repeating-linear-gradient(135deg,#f59e0b_0px,#f59e0b_3px,transparent_3px,transparent_6px)]" /> Overlap</span>
                </div>
            </div>

            <PriceRangeOverlapBanner overlaps={overlaps} isInactive={record?.status === "Inactive"} />

            {record && (
                <AuditFooter
                    createdBy={record.createdBy}
                    createdAt={record.createdAt}
                    updatedBy={record.updatedBy}
                    updatedAt={record.updatedAt}
                />
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save
                </button>
            </div>
        </form>
    );
}
