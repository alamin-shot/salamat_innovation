"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import {
    ProductsDrawerMode,
    ProductsEcommerceTab,
    ProductsFilterField,
    ProductsFilterKey,
    ProductsFilterOption,
    ProductsFilterValues,
    ProductsQuickView,
    ProductsRecordMap,
    ProductsRow,
    ProductsSortDirection,
    ProductsState,
    ProductsStatusTab,
    ProductsTabKey,
    RecordStatus,
} from "@/types/products";
import { PRODUCTS_DRAWER_MODES, PRODUCTS_PER_PAGE, PRODUCTS_TAB_LABELS } from "@/constants/products";
import { isColorAttribute } from "@/utils/productRules";

// LAYER 3: Single orchestration hook for every Products section table.
// Each Products route passes its own tab key; the route itself is the "tab".

// ── Per-tab wiring ──────────────────────────────────────────────────────────
type RowSelectorMap = { [P in ProductsTabKey]: (state: ProductsState) => ProductsRecordMap[P][] };
type SearchTextMap = { [P in ProductsTabKey]: (row: ProductsRecordMap[P]) => string[] };
type IdsActionMap = Record<ProductsTabKey, (state: ProductsState, ids: string[]) => void>;

const ROW_SELECTORS: RowSelectorMap = {
    products: (state) => state.products,
    used_products: (state) => state.usedProducts,
    categories: (state) => state.categories,
    brands: (state) => state.brands,
    pages: (state) => state.pages,
    attributes: (state) => state.attributes,
    specification_groups: (state) => state.specGroups,
    warranty_care_text: (state) => state.warrantyCareTexts,
};

// Same fields the existing tables search on.
const SEARCH_TEXT: SearchTextMap = {
    products: (row) => [row.name, row.category, row.brand],
    used_products: (row) => [row.name, row.variant, row.serialNumber],
    categories: (row) => [row.name, row.parentCategory],
    brands: (row) => [row.name, row.tagline],
    pages: (row) => [row.title, row.slug],
    attributes: (row) => [row.name, ...row.values.map((value) => value.label)],
    specification_groups: (row) => [row.name, ...row.subGroups],
    warranty_care_text: (row) => [row.text],
};

// ── Filter dropdowns per tab ────────────────────────────────────────────────
interface FilterDef<T> {
    key: ProductsFilterKey;
    label: string;
    /** The value a row is matched on; must never be "" (that means "All"). */
    getValue: (row: T) => string;
    /** Choices always offered. */
    options?: ProductsFilterOption[];
    /** true: only `options` are offered. false: distinct row values are added too. */
    closed?: boolean;
}
type FilterDefMap = { [P in ProductsTabKey]: FilterDef<ProductsRecordMap[P]>[] };

/** Stands in for a blank / "-" value so it never collides with "All" (""). */
const NONE_VALUE = "__none__";
const orNone = (value: string): string => {
    const trimmed = value.trim();
    return trimmed === "" || trimmed === "-" ? NONE_VALUE : trimmed;
};

const STATUS_OPTIONS: ProductsFilterOption[] = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
];

const statusFilter = <T extends { status: string }>(): FilterDef<T> => ({
    key: "status",
    label: "Status",
    getValue: (row) => row.status,
    // Open: product rows can also hold "Coming Soon" / "Arrival".
    options: STATUS_OPTIONS,
});

const ecommerceFilter = <T extends { ecommerce: boolean }>(): FilterDef<T> => ({
    key: "ecommerce",
    label: "Ecommerce",
    getValue: (row) => (row.ecommerce ? "on" : "off"),
    options: [
        { label: "On", value: "on" },
        { label: "Off", value: "off" },
    ],
    closed: true,
});

const FILTER_DEFS: FilterDefMap = {
    products: [
        { key: "category", label: "Category", getValue: (row) => orNone(row.category) },
        { key: "brand", label: "Brand", getValue: (row) => orNone(row.brand) },
        statusFilter(),
        ecommerceFilter(),
    ],
    used_products: [
        {
            key: "sold",
            label: "Sold",
            getValue: (row) => (row.isSold ? "sold" : "available"),
            options: [
                { label: "Available", value: "available" },
                { label: "Sold", value: "sold" },
            ],
            closed: true,
        },
        statusFilter(),
        ecommerceFilter(),
    ],
    categories: [
        { key: "parentCategory", label: "Parent Category", getValue: (row) => orNone(row.parentCategory) },
        statusFilter(),
        ecommerceFilter(),
    ],
    brands: [statusFilter(), ecommerceFilter()],
    pages: [statusFilter(), ecommerceFilter()],
    attributes: [
        {
            key: "attributeType",
            label: "Type",
            getValue: (row) => (isColorAttribute(row.name) ? "colour" : "other"),
            options: [
                { label: "Colour", value: "colour" },
                { label: "Other", value: "other" },
            ],
            closed: true,
        },
    ],
    specification_groups: [
        { key: "specName", label: "Specification", getValue: (row) => orNone(row.name) },
    ],
    warranty_care_text: [statusFilter()],
};

function buildFilterOptions<T>(def: FilterDef<T>, rows: T[], selected: string | undefined): ProductsFilterOption[] {
    const options = [...(def.options ?? [])];
    const known = new Set(options.map((option) => option.value));

    if (!def.closed) {
        const extra = Array.from(new Set(rows.map(def.getValue)))
            .filter((value) => !known.has(value))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
        extra.forEach((value) => {
            known.add(value);
            options.push({ label: value === NONE_VALUE ? "None" : value, value });
        });
    }

    // Keep the active choice listed after its last record is gone, so it stays visible and clearable.
    if (selected && !known.has(selected)) {
        options.push({ label: selected === NONE_VALUE ? "None" : selected, value: selected });
    }
    return options;
}

const STATUS_TABS: ProductsStatusTab[] =["products", "used_products", "categories", "brands", "pages", "warranty_care_text"];
const ECOMMERCE_TABS: ProductsEcommerceTab[] = ["products", "used_products", "categories", "brands", "pages"];

const isStatusTab = (tab: ProductsTabKey): tab is ProductsStatusTab =>
    STATUS_TABS.some((item) => item === tab);

const isEcommerceTab = (tab: ProductsTabKey): tab is ProductsEcommerceTab =>
    ECOMMERCE_TABS.some((item) => item === tab);

const DELETE_ROWS: IdsActionMap = {
    products: (state, ids) => state.deleteProducts(ids),
    used_products: (state, ids) => state.deleteUsedProducts(ids),
    categories: (state, ids) => state.deleteCategories(ids),
    brands: (state, ids) => state.deleteBrands(ids),
    pages: (state, ids) => state.deletePages(ids),
    attributes: (state, ids) => state.deleteAttributes(ids),
    specification_groups: (state, ids) => state.deleteSpecGroups(ids),
    warranty_care_text: (state, ids) => state.deleteWarrantyCareTexts(ids),
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const getRowId = (row: ProductsRow): string => row.id;

function toDrawerMode(value: string | null): ProductsDrawerMode {
    const match = PRODUCTS_DRAWER_MODES.find((mode) => mode === value);
    return match ?? "none";
}

function compareValues(a: unknown, b: unknown): number {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }
    return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
}

function parsePage(value: string | null): number {
    const parsed = value ? parseInt(value, 10) : 1;
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function useProductsManager<K extends ProductsTabKey>(tab: K) {
    const store = useGlobalProductsStore();
    const command = useCommandParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const rows: ProductsRecordMap[K][] = ROW_SELECTORS[tab](store);

    // ── View state ──────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(parsePage(searchParams.get("page")));
    const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);
    const [sortKey, setSortKey] = useState<(keyof ProductsRecordMap[K] & string) | null>(null);
    const [sortDirection, setSortDirection] = useState<ProductsSortDirection>(null);
    const [quickView, setQuickView] = useState<ProductsQuickView | null>(null);
    const [filters, setFilters] = useState<ProductsFilterValues>({});
    const isFirstSearchEffect = useRef(true);

    // Debounced search, same timing as the shared table manager.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (isFirstSearchEffect.current) {
            isFirstSearchEffect.current = false;
            return;
        }
        setCurrentPage(1);
    }, [debouncedQuery]);

    // Keep `?page=` and `?search=` in the URL, as the existing tables do.
    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            const search = params.get("search") || "";
            setCurrentPage(parsePage(params.get("page")));
            setSearchQuery(search);
            setDebouncedQuery(search);
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        const currentParams = new URLSearchParams(window.location.search);
        const targetParams = new URLSearchParams(window.location.search);
        targetParams.set("page", currentPage.toString());
        if (debouncedQuery.trim()) {
            targetParams.set("search", debouncedQuery.trim());
        } else {
            targetParams.delete("search");
        }
        if (currentParams.toString() !== targetParams.toString()) {
            window.history.replaceState(null, "", `${pathname}?${targetParams.toString()}`);
        }
    }, [currentPage, debouncedQuery, pathname]);

    // ── Filter dropdowns ────────────────────────────────────────────────────
    const filterFields: ProductsFilterField[] = useMemo(
        () => FILTER_DEFS[tab].map((def) => ({
            key: def.key,
            label: def.label,
            options: buildFilterOptions(def, rows, filters[def.key]),
        })),
        [tab, rows, filters],
    );

    const activeFilterCount = Object.keys(filters).length;

    // A filter change re-shapes the visible rows, so go back to page 1 and drop
    // the selection; bulk actions never touch rows the user can no longer see.
    const setFilter = useCallback((key: ProductsFilterKey, value: string) => {
        setFilters((prev) => {
            const next = { ...prev };
            if (value) {
                next[key] = value;
            } else {
                delete next[key];
            }
            return next;
        });
        setCurrentPage(1);
        setSelectedIds([]);
    }, []);

    /** "Clear" in the filter bar resets the dropdowns and the search box. */
    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchQuery("");
        setCurrentPage(1);
        setSelectedIds([]);
    }, []);

    // ── Data pipeline (Search -> Filter -> Sort -> Paginate) ────────────────
    const activeTabData = useMemo(() => {
        const query = debouncedQuery.trim().toLowerCase();
        const getSearchText = SEARCH_TEXT[tab];
        const activeDefs = FILTER_DEFS[tab].filter((def) => filters[def.key]);

        const filtered = query || activeDefs.length > 0
            ? rows.filter((row) => (
                (!query || getSearchText(row).some((text) => text.toLowerCase().includes(query)))
                && activeDefs.every((def) => def.getValue(row) === filters[def.key])
            ))
            : rows;

        if (!sortKey || !sortDirection) {
            return filtered;
        }
        const direction = sortDirection === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => compareValues(a[sortKey], b[sortKey]) * direction);
    }, [rows, tab, debouncedQuery, filters, sortKey, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(activeTabData.length / perPage));

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return activeTabData.slice(start, start + perPage);
    }, [activeTabData, currentPage, perPage]);

    // ── Sorting ─────────────────────────────────────────────────────────────
    const handleSort = useCallback((key: keyof ProductsRecordMap[K] & string) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDirection("asc");
            return;
        }
        if (sortDirection === "asc") {
            setSortDirection("desc");
            return;
        }
        if (sortDirection === "desc") {
            setSortKey(null);
            setSortDirection(null);
            return;
        }
        setSortDirection("asc");
    }, [sortKey, sortDirection]);

    // ── Selection ───────────────────────────────────────────────────────────
    const isAllSelected = activeTabData.length > 0 && selectedIds.length === activeTabData.length;

    const toggleSelection = useCallback((id: string | "ALL") => {
        if (id === "ALL") {
            setSelectedIds((prev) => (
                prev.length === activeTabData.length && activeTabData.length > 0
                    ? []
                    : activeTabData.map(getRowId)
            ));
            return;
        }
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }, [activeTabData]);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    // ── Record actions ──────────────────────────────────────────────────────
    const label = PRODUCTS_TAB_LABELS[tab];

    const handleSetStatus = useCallback((id: string, status: RecordStatus) => {
        if (!isStatusTab(tab)) {
            return;
        }
        store.setRecordStatus(tab, id, status);
        toast.success(`${label} status set to ${status}.`);
    }, [tab, store, label]);

    const handleToggleEcommerce = useCallback((id: string) => {
        if (!isEcommerceTab(tab)) {
            return;
        }
        store.toggleRecordEcommerce(tab, id);
        toast.success(`${label} ecommerce visibility updated.`);
    }, [tab, store, label]);

    const handleDelete = useCallback((ids: string[]) => {
        if (ids.length === 0) {
            return;
        }
        const countBefore = ROW_SELECTORS[tab](useGlobalProductsStore.getState()).length;
        DELETE_ROWS[tab](store, ids);
        const countAfter = ROW_SELECTORS[tab](useGlobalProductsStore.getState()).length;

        const removedCount = countBefore - countAfter;
        const keptCount = ids.length - removedCount;

        // Pagination garbage collection: never strand the user on an empty page.
        const remainingCount = Math.max(0, activeTabData.length - removedCount);
        const newMaxPage = Math.max(1, Math.ceil(remainingCount / perPage));
        setCurrentPage((page) => Math.min(page, newMaxPage));
        setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));

        if (removedCount > 0) {
            toast.success(removedCount === 1 ? `${label} deleted successfully.` : `Deleted ${removedCount} records.`);
        }
        if (keptCount > 0) {
            toast.error(`${keptCount} record(s) are still in use and were not deleted.`);
        }
    }, [tab, store, label, activeTabData.length, perPage]);

    const handleBulkDelete = useCallback(() => {
        handleDelete(selectedIds);
    }, [handleDelete, selectedIds]);

    // ── Drawer / modal state (URL-driven, same params as before) ────────────
    const drawerMode = toDrawerMode(command.activeDrawer ?? command.activeModal);
    const activeId = command.activeId;

    const activeRecord = useMemo(() => {
        if (!activeId) {
            return null;
        }
        return rows.find((row) => getRowId(row) === activeId) ?? null;
    }, [rows, activeId]);

    const quickViewRecord = useMemo(() => {
        if (!quickView) {
            return null;
        }
        return rows.find((row) => getRowId(row) === quickView.id) ?? null;
    }, [rows, quickView]);

    const openDrawer = useCallback((kind: "drawer" | "modal", mode: Exclude<ProductsDrawerMode, "none">, id?: string) => {
        startTransition(() => {
            command.openView(kind, mode, id);
        });
    }, [command]);

    const closeDrawer = useCallback(() => {
        startTransition(() => {
            command.closeView();
        });
    }, [command]);

    return {
        tab,
        store,
        isPending,

        // Data & search
        rows,
        activeTabData,
        paginatedData,
        searchQuery,
        setSearchQuery,

        // Filters
        filters,
        filterFields,
        activeFilterCount,
        setFilter,
        clearFilters,

        // Sorting
        sortKey,
        sortDirection,
        handleSort,

        // Selection
        selectedIds,
        setSelectedIds,
        toggleSelection,
        clearSelection,
        isAllSelected,

        // Pagination
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        totalPages,

        // Record actions
        handleSetStatus,
        handleToggleEcommerce,
        handleDelete,
        handleBulkDelete,

        // Drawer / modal
        drawerMode,
        activeId,
        activeRecord,
        openDrawer,
        closeDrawer,

        // In-table quick views
        quickView,
        setQuickView,
        quickViewRecord,
    };
}

export type ProductsManager<K extends ProductsTabKey> = ReturnType<typeof useProductsManager<K>>;
