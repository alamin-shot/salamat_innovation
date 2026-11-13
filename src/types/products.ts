// LAYER 1: Products section type definitions.
// Field names mirror the existing table/form components so Phase 2 can swap
// their inline mock data for the store without changing any rendered design.
import type { RefObject } from "react";
import type { StoreApi } from "zustand";

// ── Navigation & view unions ────────────────────────────────────────────────
export type ProductsTabKey =
    | "products"
    | "used_products"
    | "categories"
    | "brands"
    | "pages"
    | "attributes"
    | "specification_groups"
    | "warranty_care_text"
    | "price_ranges";

/** Values the Products pages already write to `?drawer=` / `?modal=`. */
export type ProductsDrawerMode =
    | "none"
    | "add-product"
    | "edit"
    | "preview"
    | "specs"
    | "variants"
    | "care"
    | "add-used"
    | "edit-used"
    | "add"
    | "reorder";

/** In-table quick views (currently opened through local state, not the URL). */
export type ProductsQuickViewType = "warranty" | "variants" | "specs" | "care" | "price";

export interface ProductsQuickView {
    type: ProductsQuickViewType;
    id: string;
}

export type ProductsSortDirection = "asc" | "desc" | null;

// ── Shared ──────────────────────────────────────────────────────────────────
export type RecordStatus = "Active" | "Inactive";
export type ProductStatus = "Active" | "Inactive" | "Coming Soon" | "Arrival";

/** Audit columns. Dates use the DD-MM-YYYY format the tables already display. */
export interface AuditStamp {
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    updatedBy: string | null;
}

export type AuditKeys = keyof AuditStamp;

// ── Warranty Care Text (centralized library) ────────────────────────────────
export interface WarrantyCareText extends AuditStamp {
    id: string;
    text: string;
    status: RecordStatus;
}

// ── Price Ranges (storefront price filter chips) ────────────────────────────
export interface PriceRange extends AuditStamp {
    id: string;
    /** Shown on the storefront chip, e.g. "Budget Friendly". */
    label: string;
    /** BDT, whole taka, >= 0. */
    minPrice: number;
    /** BDT; null means "and above". */
    maxPrice: number | null;
    status: RecordStatus;
    /** Mocked until the backend supplies the live count. */
    productCount: number;
}

/** Another range sharing part of a range's span. Edges may touch: 0–500 and 500–1000 do not overlap. */
export interface PriceRangeOverlap {
    rangeId: string;
    label: string;
    from: number;
    /** null = the shared part is open-ended. */
    to: number | null;
}

/** A price stretch that no Active range covers. */
export interface PriceRangeGap {
    from: number;
    to: number;
}

/** Where the Active ranges leave holes in the storefront filter. */
export interface PriceRangeCoverage {
    gaps: PriceRangeGap[];
    /** Prices from here up are not covered (no open-ended range); null when covered. */
    uncoveredFrom: number | null;
}

export type PriceRangeBounds = Pick<PriceRange, "minPrice" | "maxPrice">;

/** Raw drawer form values, before validation. */
export interface PriceRangeDraft {
    label: string;
    minText: string;
    maxText: string;
    isOpenEnded: boolean;
}

export type PriceRangeValidationError = "label_required" | "min_invalid" | "max_invalid" | "max_not_above_min";

export type PriceRangeValidation =
    | { ok: true; value: Pick<PriceRange, "label" | "minPrice" | "maxPrice"> }
    | { ok: false; error: PriceRangeValidationError };

// ── Products ────────────────────────────────────────────────────────────────
export interface ProductWarrantyDetails {
    purchasePoint: string;
    warrantyDays: number | null;
    /** Reference into the Warranty Care Text library; null when none is selected. */
    warrantyCareTextId: string | null;
    serviceWarranty: string;
}

export interface ProductVideo {
    id: string;
    name: string;
    sizeBytes: number;
}

export type ProductVideoInput = Omit<ProductVideo, "id">;

export interface ProductVariantOption {
    id: string;
    name: string;
    values: string[];
    /** Image per value, keyed by value label. Only used when the option is a colour attribute. */
    valueImages: Record<string, string>;
}

export interface ProductVariant {
    id: string;
    title: string;
    sku: string;
    maxRetailPrice: number | null;
    sellingPrice: number | null;
    inStock: boolean;
    /** Open for pre-booking. Never true together with `inStock`. */
    isPrebook: boolean;
}

/** The fields a variant row edits inline and saves. */
export type ProductVariantEdit = Pick<ProductVariant, "sku" | "maxRetailPrice" | "sellingPrice" | "inStock" | "isPrebook">;

/**
 * Unsaved row edits of one variants table, keyed by variant id.
 * A row has an entry only while its values differ from the saved ones.
 */
export interface VariantDraftState {
    drafts: Record<string, ProductVariantEdit>;
    editVariant: (baseline: ProductVariant, changes: Partial<ProductVariantEdit>) => void;
    setAllInStock: (baselines: ProductVariant[], inStock: boolean) => void;
    discardVariant: (id: string) => void;
    /** Drops drafts of rows that no longer exist after the attribute builder changed. */
    pruneDrafts: (keepIds: string[]) => void;
}

export type VariantDraftStore = StoreApi<VariantDraftState>;

/** Row-level Save. Omitted where the parent form saves everything (Add/Edit Product). */
export interface VariantRowSaveConfig {
    /** True while attribute-builder changes are unsaved; only Save All can save then. */
    isBlocked: boolean;
    onSave: (variant: ProductVariant, edit: ProductVariantEdit) => void;
}

/** Lets a drawer ask its form whether closing would lose edits. */
export interface UnsavedChangesHandle {
    hasUnsavedChanges: () => boolean;
}

export interface UnsavedChangesGuard {
    formRef: RefObject<UnsavedChangesHandle | null>;
    /** Runs `action` now, or after the user confirms discarding unsaved changes. */
    run: (action: () => void) => void;
    isConfirmOpen: boolean;
    confirm: () => void;
    cancel: () => void;
}

export interface Product extends AuditStamp {
    id: string;
    name: string;
    image: string | null;
    category: string;
    brand: string;
    status: ProductStatus;
    ecommerce: boolean;
    tags: string[];
    headline: string;
    keyFeatures: string;
    variantsCount: number;
    specsCount: number;
    hasCare: boolean;
    /** Id of a record on the /admin/care page; null when no care plan is attached. */
    carePlanId: string | null;
    warrantyActive: boolean;
    warranty: ProductWarrantyDetails;
    bookingMoneyEnabled: boolean;
    bookingMoney: number | null;
    videos: ProductVideo[];
    variantOptions: ProductVariantOption[];
    variants: ProductVariant[];
}

// ── Used products ───────────────────────────────────────────────────────────
export interface UsedProduct extends AuditStamp {
    id: string;
    name: string;
    image: string | null;
    variant: string;
    maxRetailPrice: number | null;
    sellingPrice: number | null;
    serialNumber: string;
    carePlan: string;
    boxAvailable: boolean;
    isSold: boolean;
    status: RecordStatus;
    ecommerce: boolean;
}

// ── Catalog taxonomy ────────────────────────────────────────────────────────
export interface Brand extends AuditStamp {
    id: string;
    name: string;
    logo: string | null;
    totalProducts: number;
    tagline: string;
    androidAppLink: string;
    iosAppLink: string;
    primaryLogo: string | null;
    secondaryLogo: string | null;
    shopBanner: string | null;
    infoBanner: string | null;
    status: RecordStatus;
    ecommerce: boolean;
}

export interface Category extends AuditStamp {
    id: string;
    name: string;
    parentCategory: string;
    totalProducts: number;
    logo: string | null;
    secLogo: string | null;
    banner: string | null;
    infoBanner: string | null;
    status: RecordStatus;
    ecommerce: boolean;
}

export interface ProductPage extends AuditStamp {
    id: string;
    title: string;
    slug: string;
    shop: string;
    avatar: string | null;
    secondaryLogo: string | null;
    shopBanner: string | null;
    infoBanner: string | null;
    status: RecordStatus;
    ecommerce: boolean;
}

export interface AttributeValue {
    id: string;
    label: string;
    /** Only used when the parent attribute is a colour attribute. */
    image: string | null;
}

export interface ProductAttribute extends AuditStamp {
    id: string;
    name: string;
    values: AttributeValue[];
}

export interface SpecGroup extends AuditStamp {
    id: string;
    name: string;
    subGroups: string[];
}

// ── Record map (drives the generic manager) ─────────────────────────────────
export interface ProductsRecordMap {
    products: Product;
    used_products: UsedProduct;
    categories: Category;
    brands: Brand;
    pages: ProductPage;
    attributes: ProductAttribute;
    specification_groups: SpecGroup;
    warranty_care_text: WarrantyCareText;
    price_ranges: PriceRange;
}

export type ProductsRow = ProductsRecordMap[ProductsTabKey];

/** Tabs whose rows carry an Active/Inactive status (shown as a status dropdown). */
export type ProductsStatusTab = Exclude<ProductsTabKey, "attributes" | "specification_groups">;

/** Tabs whose rows carry an Ecommerce on/off flag. */
export type ProductsEcommerceTab = Exclude<ProductsStatusTab, "warranty_care_text" | "price_ranges">;

// ── Inputs (id and audit columns are stamped by the store) ──────────────────
export type ProductInput = Omit<Product, "id" | AuditKeys>;
export type UsedProductInput = Omit<UsedProduct, "id" | AuditKeys>;
export type BrandInput = Omit<Brand, "id" | AuditKeys>;
export type CategoryInput = Omit<Category, "id" | AuditKeys>;
export type ProductPageInput = Omit<ProductPage, "id" | AuditKeys>;
export type ProductAttributeInput = Omit<ProductAttribute, "id" | AuditKeys>;
export type SpecGroupInput = Omit<SpecGroup, "id" | AuditKeys>;
export type WarrantyCareTextInput = Omit<WarrantyCareText, "id" | AuditKeys>;
export type PriceRangeInput = Omit<PriceRange, "id" | AuditKeys>;

// ── Derived values ──────────────────────────────────────────────────────────
export type DiscountState = "incomplete" | "none" | "discounted" | "selling_above_mrp";

export interface DiscountResult {
    state: DiscountState;
    /** MRP minus selling price; 0 unless state is "discounted". */
    amount: number;
    /** Discount as a percentage of MRP, rounded to 2 decimals. */
    percent: number;
}

// ── Table filters (driven by useProductsManager) ────────────────────────────
export type ProductsFilterKey =
    | "category"
    | "brand"
    | "status"
    | "ecommerce"
    | "sold"
    | "parentCategory"
    | "attributeType"
    | "specName";

/** Selected filter values; a missing key means "All". */
export type ProductsFilterValues = Partial<Record<ProductsFilterKey, string>>;

export interface ProductsFilterOption {
    label: string;
    value: string;
}

/** One filter dropdown, with options already built from the live records. */
export interface ProductsFilterField {
    key: ProductsFilterKey;
    label: string;
    options: ProductsFilterOption[];
}

export interface ProductCareOption {
    id: string;
    label: string;
    inactive: boolean;
}


// ── Store contract ──────────────────────────────────────────────────────────
export interface ProductsState {
    products: Product[];
    usedProducts: UsedProduct[];
    categories: Category[];
    brands: Brand[];
    pages: ProductPage[];
    attributes: ProductAttribute[];
    specGroups: SpecGroup[];
    warrantyCareTexts: WarrantyCareText[];
    priceRanges: PriceRange[];

    // Status & Ecommerce (shared by every table that shows them)
    setRecordStatus: (tab: ProductsStatusTab, id: string, status: RecordStatus) => void;
    toggleRecordEcommerce: (tab: ProductsEcommerceTab, id: string) => void;

    // Products
    addProduct: (input: ProductInput) => void;
    updateProduct: (id: string, updates: Partial<ProductInput>) => void;
    deleteProducts: (ids: string[]) => void;
    toggleProductWarranty: (id: string) => void;
    toggleProductBookingMoney: (id: string) => void;
    updateProductWarranty: (id: string, updates: Partial<ProductWarrantyDetails>) => void;
    setProductCarePlan: (id: string, carePlanId: string | null) => void;
    saveProductVariants: (id: string, options: ProductVariantOption[], variants: ProductVariant[]) => void;
    updateProductVariant: (productId: string, variantId: string, edit: ProductVariantEdit) => void;
    addProductVideos: (id: string, videos: ProductVideoInput[]) => void;
    removeProductVideo: (id: string, videoId: string) => void;

    // Used products
    addUsedProduct: (input: UsedProductInput) => void;
    updateUsedProduct: (id: string, updates: Partial<UsedProductInput>) => void;
    deleteUsedProducts: (ids: string[]) => void;

    // Categories
    addCategory: (input: CategoryInput) => void;
    updateCategory: (id: string, updates: Partial<CategoryInput>) => void;
    deleteCategories: (ids: string[]) => void;

    // Brands
    addBrand: (input: BrandInput) => void;
    updateBrand: (id: string, updates: Partial<BrandInput>) => void;
    deleteBrands: (ids: string[]) => void;

    // Pages
    updatePage: (id: string, updates: Partial<ProductPageInput>) => void;
    deletePages: (ids: string[]) => void;

    // Attributes
    addAttribute: (input: ProductAttributeInput) => void;
    updateAttribute: (id: string, updates: Partial<ProductAttributeInput>) => void;
    deleteAttributes: (ids: string[]) => void;

    // Specification groups
    addSpecGroup: (input: SpecGroupInput) => void;
    updateSpecGroup: (id: string, updates: Partial<SpecGroupInput>) => void;
    deleteSpecGroups: (ids: string[]) => void;

    // Warranty Care Text library
    addWarrantyCareText: (input: WarrantyCareTextInput) => void;
    updateWarrantyCareText: (id: string, updates: Partial<WarrantyCareTextInput>) => void;
    /** Texts still selected on a product are kept; only unused ones are removed. */
    deleteWarrantyCareTexts: (ids: string[]) => void;

    // Price ranges
    addPriceRange: (input: PriceRangeInput) => void;
    updatePriceRange: (id: string, updates: Partial<PriceRangeInput>) => void;
    deletePriceRanges: (ids: string[]) => void;
}
