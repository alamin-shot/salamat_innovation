import { ProductsDrawerMode, ProductsTabKey } from "@/types/products";

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
};
