import { PriceRangeValidationError, ProductsDrawerMode, ProductsTabKey } from "@/types/products";

/** Hard limit on uploaded video files per product (client requirement). */
export const MAX_PRODUCT_VIDEOS = 4;

export const PRODUCT_VIDEO_HELPER_TEXT = `You can upload up to ${MAX_PRODUCT_VIDEOS} videos per product.`;
export const PRODUCT_VIDEO_LIMIT_MESSAGE = `Video limit reached. A product can have a maximum of ${MAX_PRODUCT_VIDEOS} videos.`;

/** Stamped as CreatedBy/UpdatedBy until the live auth session is wired. */
export const PRODUCTS_AUDIT_ACTOR = "Admin";

export const PRODUCTS_PER_PAGE = 10;

/** Every value the Products pages write to `?drawer=` / `?modal=`. */
export const PRODUCTS_DRAWER_MODES: ProductsDrawerMode[] = [
    "none",
    "add-product",
    "edit",
    "preview",
    "specs",
    "variants",
    "care",
    "add-used",
    "edit-used",
    "add",
    "reorder",
];

/** Singular labels used in toast messages. */
export const PRODUCTS_TAB_LABELS: Record<ProductsTabKey, string> = {
    products: "Product",
    used_products: "Used product",
    categories: "Category",
    brands: "Brand",
    pages: "Page",
    attributes: "Attribute",
    specification_groups: "Specification group",
    warranty_care_text: "Warranty care text",
    price_ranges: "Price range",
};

/** Snap step (৳) for the price range slider. */
export const PRICE_RANGE_SLIDER_STEP = 500;

/** The range bar scale is rounded up to a multiple of this (৳). */
export const PRICE_RANGE_SCALE_STEP = 10000;

/** Headroom past an open-ended range's start, so "and above" still draws as a bar. */
export const PRICE_RANGE_OPEN_END_HEADROOM = 0.25;

export const PRICE_RANGE_ERROR_MESSAGES: Record<PriceRangeValidationError, string> = {
    label_required: "Range label is required.",
    min_invalid: "Minimum price must be a whole number of 0 or more.",
    max_invalid: "Maximum price must be a whole number, or turn on \"and above\".",
    max_not_above_min: "Maximum price must be higher than the minimum price.",
};
