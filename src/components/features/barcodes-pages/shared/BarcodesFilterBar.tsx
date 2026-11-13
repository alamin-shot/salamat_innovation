import * as React from "react";
import { SectionFilterBar } from "@/components/ui/SectionFilterBar";
import { BarcodesManager } from "@/hooks/barcode_hooks/useBarcodesManager";
import { BarcodesTabKey } from "@/types/barcodes";

type FilterBarManager = Pick<
    BarcodesManager<BarcodesTabKey>,
    | "searchQuery"
    | "setSearchQuery"
    | "filters"
    | "filterFields"
    | "activeFilterCount"
    | "setFilter"
    | "dateRange"
    | "setDateRange"
    | "clearFilters"
    | "activeTabData"
>;

interface BarcodesFilterBarProps {
    manager: FilterBarManager;
    /** Label of the date-range chip ("Created" on List / Generate, "Event Date" on History). */
    dateLabel: string;
    /** Right-hand slot, e.g. the Columns dropdown. */
    actions?: React.ReactNode;
}

/** Search, filter chips and date range for every Barcodes table; all state lives in useBarcodesManager. */
export function BarcodesFilterBar({ manager, dateLabel, actions }: BarcodesFilterBarProps) {
    const { filterFields, filters, setFilter } = manager;

    const chips = React.useMemo(
        () => filterFields.map((field) => ({
            key: field.key,
            label: field.label,
            options: field.options,
            value: filters[field.key] ?? "",
            onChange: (value: string) => setFilter(field.key, value),
        })),
        [filterFields, filters, setFilter],
    );

    return (
        <SectionFilterBar
            searchQuery={manager.searchQuery}
            onSearchChange={manager.setSearchQuery}
            filters={chips}
            dateFilter={{ label: dateLabel, value: manager.dateRange, onChange: manager.setDateRange }}
            activeFilterCount={manager.activeFilterCount}
            onClearAll={manager.clearFilters}
            resultCount={manager.activeTabData.length}
            actions={actions}
        />
    );
}
