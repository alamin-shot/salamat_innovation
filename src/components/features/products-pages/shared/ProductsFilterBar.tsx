import * as React from "react";
import { SectionFilterBar } from "@/components/ui/SectionFilterBar";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { ProductsTabKey } from "@/types/products";

type FilterBarManager = Pick<
    ProductsManager<ProductsTabKey>,
    "searchQuery" | "setSearchQuery" | "filters" | "filterFields" | "activeFilterCount" | "setFilter" | "clearFilters" | "activeTabData"
>;

interface ProductsFilterBarProps {
    manager: FilterBarManager;
    /** Right-hand slot, e.g. the Columns dropdown. */
    actions?: React.ReactNode;
}

/** Search + filter chips for every Products section table; all state lives in useProductsManager. */
export function ProductsFilterBar({ manager, actions }: ProductsFilterBarProps) {
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
            activeFilterCount={manager.activeFilterCount}
            onClearAll={manager.clearFilters}
            resultCount={manager.activeTabData.length}
            actions={actions}
        />
    );
}
