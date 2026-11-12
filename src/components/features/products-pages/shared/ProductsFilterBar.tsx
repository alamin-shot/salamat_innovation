import * as React from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { ProductsTabKey } from "@/types/products";

type FilterBarManager = Pick<
    ProductsManager<ProductsTabKey>,
    "searchQuery" | "setSearchQuery" | "filters" | "filterFields" | "activeFilterCount" | "setFilter" | "clearFilters"
>;

interface ProductsFilterBarProps {
    manager: FilterBarManager;
}

/** Search + filter dropdowns for every Products section table; all state lives in useProductsManager. */
export function ProductsFilterBar({ manager }: ProductsFilterBarProps) {
    return (
        <FilterBar
            searchQuery={manager.searchQuery}
            onSearchChange={manager.setSearchQuery}
            activeFilterCount={manager.activeFilterCount}
            onClearFilters={manager.clearFilters}
        >
            {manager.filterFields.map((field) => (
                <FilterDropdown
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    selectedValue={manager.filters[field.key] ?? ""}
                    onSelect={(value) => manager.setFilter(field.key, value)}
                />
            ))}
        </FilterBar>
    );
}
