import * as React from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DateRangeFilter, formatDateRangeLabel } from "@/components/ui/DateRangeFilter";
import { SectionDateFilter, SectionFilterChip } from "@/types/ui";

// Filter bar for tables with many filters (Products and Barcodes sections).
// Never scrolls sideways: chips wrap onto new lines, active choices show as
// removable pills with a result count, and on mobile the chips fold behind a
// "Filters" toggle. All filter state stays in the page's manager hook.

interface SectionFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters: SectionFilterChip[];
    dateFilter?: SectionDateFilter;
    /** Active dropdowns + date range (search is shown separately). */
    activeFilterCount: number;
    onClearAll: () => void;
    resultCount?: number;
    /** Right-hand slot, e.g. the Columns dropdown. */
    actions?: React.ReactNode;
}

/** Up to this many chips sit on the search row; more get their own wrapping row. */
const INLINE_CHIP_LIMIT = 2;

function ActivePill({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
    return (
        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-brand-primary/30 bg-brand-primary/10 py-1 pl-2.5 pr-1 text-xs text-brand-text">
            <span className="text-brand-subtext">{label}:</span>
            <span className="truncate font-semibold">{value}</span>
            <button
                type="button"
                onClick={onRemove}
                title={`Remove ${label} filter`}
                className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-brand-subtext transition-colors hover:bg-white hover:text-red-600"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

export function SectionFilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    filters,
    dateFilter,
    activeFilterCount,
    onClearAll,
    resultCount,
    actions,
}: SectionFilterBarProps) {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const chipCount = filters.length + (dateFilter ? 1 : 0);
    const isInline = chipCount <= INLINE_CHIP_LIMIT;
    const trimmedSearch = searchQuery.trim();
    const hasDate = Boolean(dateFilter && (dateFilter.value.from || dateFilter.value.to));
    const hasActive = activeFilterCount > 0 || trimmedSearch !== "";

    const chips = chipCount === 0 ? null : (
        <div className={`${isMobileOpen ? "flex" : "hidden"} sm:flex flex-wrap items-center gap-2`}>
            {!isInline && (
                <span className="hidden sm:inline-flex items-center gap-1.5 pr-1 text-xs font-semibold text-brand-subtext">
                    <Filter className="h-3.5 w-3.5" /> Filter by
                </span>
            )}
            {filters.map((field) => (
                <div key={field.key} className="shrink-0 whitespace-nowrap">
                    <FilterDropdown label={field.label} options={field.options} selectedValue={field.value} onSelect={field.onChange} />
                </div>
            ))}
            {dateFilter && (
                <div className="shrink-0 whitespace-nowrap">
                    <DateRangeFilter label={dateFilter.label} value={dateFilter.value} onChange={dateFilter.onChange} />
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-3 p-4">
            {/* Row 1: search, inline chips (few filters), actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Full width on phones; the Filters toggle and actions drop to the next line. */}
                <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full border-brand-subtext/20 bg-brand-bg/50 pl-9 pr-8 shadow-none transition-colors hover:bg-brand-bg focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            title="Clear search"
                            className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {chipCount > 0 && (
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen((open) => !open)}
                        aria-expanded={isMobileOpen}
                        className={`sm:hidden flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${isMobileOpen ? "border-brand-primary bg-brand-primary/10 text-brand-text" : "border-brand-subtext/30 bg-white text-brand-text"}`}
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                )}

                {isInline && chips && <div className="w-full sm:w-auto">{chips}</div>}

                {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
            </div>

            {/* Row 2: every chip, wrapping (many filters) */}
            {!isInline && chips}

            {/* Row 3: what is applied right now */}
            {hasActive && (
                <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-brand-subtext/20 pt-3">
                    {trimmedSearch && <ActivePill label="Search" value={`"${trimmedSearch}"`} onRemove={() => onSearchChange("")} />}
                    {filters.filter((field) => field.value).map((field) => (
                        <ActivePill
                            key={field.key}
                            label={field.label}
                            value={field.options.find((option) => option.value === field.value)?.label ?? field.value}
                            onRemove={() => field.onChange("")}
                        />
                    ))}
                    {dateFilter && hasDate && (
                        <ActivePill
                            label={dateFilter.label}
                            value={formatDateRangeLabel(dateFilter.value)}
                            onRemove={() => dateFilter.onChange({ from: null, to: null })}
                        />
                    )}
                    <div className="ml-auto flex items-center gap-3">
                        {resultCount !== undefined && (
                            <span className="text-xs font-medium text-brand-subtext">
                                {resultCount} {resultCount === 1 ? "result" : "results"}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={onClearAll}
                            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                            <X className="h-3 w-3" /> Clear all
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
