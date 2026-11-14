import * as React from "react";

export interface DrawerProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: string;
    drawerStyle?: React.CSSProperties;
    className?: string;
}
/** Inclusive calendar range as YYYY-MM-DD strings; null means open-ended. */
export interface DateRangeValue {
    from: string | null;
    to: string | null;
}

export interface SectionFilterOption {
    label: string;
    value: string;
}

/** One dropdown chip of a SectionFilterBar; "" means "All". */
export interface SectionFilterChip {
    key: string;
    label: string;
    options: SectionFilterOption[];
    value: string;
    onChange: (value: string) => void;
}

/** Inclusive amount range; null = open-ended. */
export interface AmountRangeValue {
    min: number | null;
    max: number | null;
}

/** Optional amount-range chip of a SectionFilterBar. */
export interface SectionAmountFilter {
    label: string;
    value: AmountRangeValue;
    onChange: (value: AmountRangeValue) => void;
}

/** Optional date-range chip of a SectionFilterBar. */
export interface SectionDateFilter {
    label: string;
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
}
