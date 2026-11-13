"use client";
import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, DateRange, getDefaultClassNames } from "react-day-picker";
import {
    endOfMonth,
    format,
    isValid,
    parseISO,
    startOfMonth,
    subDays,
    subMonths,
} from "date-fns";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import "react-day-picker/style.css";
import { DateRangeValue } from "@/types/ui";

// Filter-bar chip that opens a two-month range calendar with quick presets.
// Controlled: the parent (a manager hook) owns the committed range; the popover
// only holds an uncommitted draft until "Apply".

interface DateRangeFilterProps {
    label?: string;
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
}

const DAY_KEY = "yyyy-MM-dd";

const toDate = (value: string | null): Date | undefined => {
    if (!value) {
        return undefined;
    }
    const date = parseISO(value);
    return isValid(date) ? date : undefined;
};

const toKey = (date: Date | undefined): string | null => (date ? format(date, DAY_KEY) : null);

const toRange = (value: DateRangeValue): DateRange | undefined => {
    const from = toDate(value.from);
    const to = toDate(value.to);
    return from || to ? { from: from ?? to, to } : undefined;
};

function formatRange(range: DateRange | undefined): string {
    if (!range?.from) {
        return "All";
    }
    if (!range.to || range.to.getTime() === range.from.getTime()) {
        return format(range.from, "dd MMM yyyy");
    }
    const sameYear = range.from.getFullYear() === range.to.getFullYear();
    return `${format(range.from, sameYear ? "dd MMM" : "dd MMM yyyy")} – ${format(range.to, "dd MMM yyyy")}`;
}

/** "06 Nov – 12 Nov 2026" for a committed range; "All" when empty. */
export function formatDateRangeLabel(value: DateRangeValue): string {
    return formatRange(toRange(value));
}

interface Preset {
    label: string;
    getRange: (today: Date) => DateRange;
}

const PRESETS: Preset[] = [
    { label: "Today", getRange: (today) => ({ from: today, to: today }) },
    { label: "Yesterday", getRange: (today) => ({ from: subDays(today, 1), to: subDays(today, 1) }) },
    { label: "Last 7 days", getRange: (today) => ({ from: subDays(today, 6), to: today }) },
    { label: "Last 30 days", getRange: (today) => ({ from: subDays(today, 29), to: today }) },
    { label: "This month", getRange: (today) => ({ from: startOfMonth(today), to: today }) },
    {
        label: "Last month",
        getRange: (today) => {
            const lastMonth = subMonths(today, 1);
            return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
        },
    },
];

const sameRange = (a: DateRange | undefined, b: DateRange | undefined): boolean => (
    toKey(a?.from) === toKey(b?.from) && toKey(a?.to ?? a?.from) === toKey(b?.to ?? b?.from)
);

// Accent colours for the calendar (emerald, the system's action colour).
const CALENDAR_STYLE = {
    "--rdp-accent-color": "#059669",
    "--rdp-accent-background-color": "#ecfdf5",
    "--rdp-day-height": "36px",
    "--rdp-day-width": "36px",
    "--rdp-day_button-height": "34px",
    "--rdp-day_button-width": "34px",
    "--rdp-nav-height": "2.25rem",
    "--rdp-months-gap": "1.5rem",
} as React.CSSProperties;

export function DateRangeFilter({ label = "Date", value, onChange }: DateRangeFilterProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange | undefined>(() => toRange(value));
    const [month, setMonth] = React.useState<Date>(() => toDate(value.from) ?? new Date());
    const defaults = getDefaultClassNames();

    const committed = toRange(value);
    const hasValue = Boolean(value.from || value.to);

    // Each opening starts from the committed range, so a cancelled draft never leaks.
    const handleOpenChange = (open: boolean) => {
        if (open) {
            const current = toRange(value);
            setDraft(current);
            setMonth(current?.from ?? new Date());
        }
        setIsOpen(open);
    };

    const handlePreset = (preset: Preset) => {
        const range = preset.getRange(new Date());
        setDraft(range);
        setMonth(range.from ?? new Date());
    };

    const handleApply = () => {
        const from = toKey(draft?.from);
        onChange({ from, to: toKey(draft?.to) ?? from });
        setIsOpen(false);
    };

    const handleClear = () => {
        setDraft(undefined);
        onChange({ from: null, to: null });
        setIsOpen(false);
    };

    const today = new Date();

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            <div className="flex shrink-0 items-center">
                <Popover.Trigger className={`flex items-center justify-between gap-2 border border-brand-subtext/30 bg-white px-3 py-1.5 text-xs font-medium text-brand-text shadow-sm transition-colors hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${hasValue ? "rounded-l-lg border-r-0" : "rounded-lg"}`}>
                    <CalendarDays className="h-3.5 w-3.5 text-brand-subtext" />
                    <span className="text-brand-subtext">{label}:</span>
                    <span className="whitespace-nowrap font-semibold text-brand-text">{formatRange(committed)}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-brand-subtext" />
                </Popover.Trigger>
                {hasValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        title="Clear date range"
                        className="flex items-center self-stretch rounded-r-lg border border-brand-subtext/30 bg-white px-2 text-brand-subtext shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            <Popover.Portal>
                <Popover.Content
                    align="start"
                    sideOffset={6}
                    collisionPadding={16}
                    className="z-[100] w-max max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-auto rounded-xl border border-brand-subtext/20 bg-white shadow-xl custom-scrollbar"
                >
                    <div className="flex flex-col sm:flex-row">
                        {/* Presets */}
                        <div className="flex gap-1 overflow-x-auto border-b border-brand-subtext/15 p-2 sm:w-36 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r custom-scrollbar">
                            {PRESETS.map((preset) => {
                                const isActive = sameRange(draft, preset.getRange(today));
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => handlePreset(preset)}
                                        className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${isActive ? "bg-emerald-50 font-bold text-emerald-700" : "text-brand-text hover:bg-brand-bg"}`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Calendar */}
                        <div className="p-3">
                            <DayPicker
                                mode="range"
                                numberOfMonths={2}
                                selected={draft}
                                onSelect={setDraft}
                                month={month}
                                onMonthChange={setMonth}
                                showOutsideDays
                                style={CALENDAR_STYLE}
                                classNames={{
                                    root: `${defaults.root} text-brand-text`,
                                    months: `${defaults.months} flex-col md:flex-row`,
                                    caption_label: `${defaults.caption_label} text-sm font-bold`,
                                    weekday: `${defaults.weekday} text-[11px] font-semibold text-brand-subtext`,
                                    day: `${defaults.day} text-xs`,
                                    today: `${defaults.today} font-bold`,
                                    chevron: `${defaults.chevron} !fill-brand-subtext`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 border-t border-brand-subtext/15 bg-brand-bg/30 px-4 py-3">
                        <span className="truncate text-xs font-medium text-brand-subtext">
                            {draft?.from ? formatRange(draft) : "Pick a start and end date"}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-xs font-bold text-brand-text transition-colors hover:bg-brand-bg"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                disabled={!draft?.from}
                                className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
