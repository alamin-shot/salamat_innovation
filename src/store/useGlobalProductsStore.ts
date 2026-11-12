import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    AuditStamp,
    Brand,
    Category,
    Product,
    ProductAttribute,
    ProductPage,
    ProductsState,
    ProductVideo,
    SpecGroup,
    UsedProduct,
    WarrantyCareText,
} from "@/types/products";
import { MAX_PRODUCT_VIDEOS, PRODUCTS_AUDIT_ACTOR } from "@/constants/products";
import { formatAuditDate } from "@/utils/productRules";
import {
    INITIAL_ATTRIBUTES,
    INITIAL_BRANDS,
    INITIAL_CATEGORIES,
    INITIAL_PAGES,
    INITIAL_PRODUCTS,
    INITIAL_SPEC_GROUPS,
    INITIAL_USED_PRODUCTS,
    INITIAL_WARRANTY_CARE_TEXTS,
} from "@/mocks/products.mock";

// LAYER 2: Optimistic cache for the Products section.
// Every action is a plain payload mutation, ready to be swapped for a NestJS call.

// ── Audit helpers ───────────────────────────────────────────────────────────
const stampCreated = (): AuditStamp => ({
    createdAt: formatAuditDate(new Date()),
    createdBy: PRODUCTS_AUDIT_ACTOR,
    updatedAt: null,
    updatedBy: null,
});

const stampUpdated = (): Pick<AuditStamp, "updatedAt" | "updatedBy"> => ({
    updatedAt: formatAuditDate(new Date()),
    updatedBy: PRODUCTS_AUDIT_ACTOR,
});

const newId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ── Collection helpers ──────────────────────────────────────────────────────
type Identified = { id: string };

/** Applies `change` to the matching row and stamps it as updated. */
function patchRow<T extends Identified & AuditStamp>(rows: T[], id: string, change: (row: T) => T): T[] {
    return rows.map((row) => {
        if (row.id !== id) {
            return row;
        }
        return { ...change(row), ...stampUpdated() };
    });
}

function removeRows<T extends Identified>(rows: T[], ids: string[]): T[] {
    return rows.filter((row) => !ids.includes(row.id));
}

export const useGlobalProductsStore = create<ProductsState>()(
    persist(
        (set) => ({
            products: INITIAL_PRODUCTS as Product[],
            usedProducts: INITIAL_USED_PRODUCTS as UsedProduct[],
            categories: INITIAL_CATEGORIES as Category[],
            brands: INITIAL_BRANDS as Brand[],
            pages: INITIAL_PAGES as ProductPage[],
            attributes: INITIAL_ATTRIBUTES as ProductAttribute[],
            specGroups: INITIAL_SPEC_GROUPS as SpecGroup[],
            warrantyCareTexts: INITIAL_WARRANTY_CARE_TEXTS as WarrantyCareText[],

            // ── Status & Ecommerce ──────────────────────────────────────────
            setRecordStatus: (tab, id, status) => set((state) => {
                switch (tab) {
                    case "products":
                        return { products: patchRow(state.products, id, (row) => ({ ...row, status })) };
                    case "used_products":
                        return { usedProducts: patchRow(state.usedProducts, id, (row) => ({ ...row, status })) };
                    case "categories":
                        return { categories: patchRow(state.categories, id, (row) => ({ ...row, status })) };
                    case "brands":
                        return { brands: patchRow(state.brands, id, (row) => ({ ...row, status })) };
                    case "pages":
                        return { pages: patchRow(state.pages, id, (row) => ({ ...row, status })) };
                    case "warranty_care_text":
                        return { warrantyCareTexts: patchRow(state.warrantyCareTexts, id, (row) => ({ ...row, status })) };
                }
            }),

            toggleRecordEcommerce: (tab, id) => set((state) => {
                switch (tab) {
                    case "products":
                        return { products: patchRow(state.products, id, (row) => ({ ...row, ecommerce: !row.ecommerce })) };
                    case "used_products":
                        return { usedProducts: patchRow(state.usedProducts, id, (row) => ({ ...row, ecommerce: !row.ecommerce })) };
                    case "categories":
                        return { categories: patchRow(state.categories, id, (row) => ({ ...row, ecommerce: !row.ecommerce })) };
                    case "brands":
                        return { brands: patchRow(state.brands, id, (row) => ({ ...row, ecommerce: !row.ecommerce })) };
                    case "pages":
                        return { pages: patchRow(state.pages, id, (row) => ({ ...row, ecommerce: !row.ecommerce })) };
                }
            }),

            // ── Products ────────────────────────────────────────────────────
            addProduct: (input) => set((state) => {
                const record: Product = { ...input, id: newId("prod"), ...stampCreated() };
                return { products: [record, ...state.products] };
            }),

            updateProduct: (id, updates) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({ ...row, ...updates })),
            })),

            deleteProducts: (ids) => set((state) => ({
                products: removeRows(state.products, ids),
            })),

            toggleProductWarranty: (id) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({ ...row, warrantyActive: !row.warrantyActive })),
            })),

            toggleProductBookingMoney: (id) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({ ...row, bookingMoneyEnabled: !row.bookingMoneyEnabled })),
            })),

            updateProductWarranty: (id, updates) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({ ...row, warranty: { ...row.warranty, ...updates } })),
            })),

            setProductCarePlan: (id, carePlanId) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({ ...row, carePlanId, hasCare: carePlanId !== null })),
            })),

            saveProductVariants: (id, options, variants) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({
                    ...row,
                    variantOptions: options,
                    variants,
                    variantsCount: variants.length,
                })),
            })),

            addProductVideos: (id, videos) => set((state) => ({
                products: patchRow(state.products, id, (row) => {
                    const remainingSlots = Math.max(0, MAX_PRODUCT_VIDEOS - row.videos.length);
                    if (remainingSlots === 0) {
                        return row;
                    }
                    const accepted: ProductVideo[] = videos
                        .slice(0, remainingSlots)
                        .map((video) => ({ ...video, id: newId("vid") }));
                    return { ...row, videos: [...row.videos, ...accepted] };
                }),
            })),

            removeProductVideo: (id, videoId) => set((state) => ({
                products: patchRow(state.products, id, (row) => ({
                    ...row,
                    videos: row.videos.filter((video) => video.id !== videoId),
                })),
            })),

            // ── Used products ───────────────────────────────────────────────
            addUsedProduct: (input) => set((state) => {
                const record: UsedProduct = { ...input, id: newId("used"), ...stampCreated() };
                return { usedProducts: [record, ...state.usedProducts] };
            }),

            updateUsedProduct: (id, updates) => set((state) => ({
                usedProducts: patchRow(state.usedProducts, id, (row) => ({ ...row, ...updates })),
            })),

            deleteUsedProducts: (ids) => set((state) => ({
                usedProducts: removeRows(state.usedProducts, ids),
            })),

            // ── Categories ──────────────────────────────────────────────────
            addCategory: (input) => set((state) => {
                const record: Category = { ...input, id: newId("cat"), ...stampCreated() };
                return { categories: [record, ...state.categories] };
            }),

            updateCategory: (id, updates) => set((state) => ({
                categories: patchRow(state.categories, id, (row) => ({ ...row, ...updates })),
            })),

            deleteCategories: (ids) => set((state) => ({
                categories: removeRows(state.categories, ids),
            })),

            // ── Brands ──────────────────────────────────────────────────────
            addBrand: (input) => set((state) => {
                const record: Brand = { ...input, id: newId("brand"), ...stampCreated() };
                return { brands: [record, ...state.brands] };
            }),

            updateBrand: (id, updates) => set((state) => ({
                brands: patchRow(state.brands, id, (row) => ({ ...row, ...updates })),
            })),

            deleteBrands: (ids) => set((state) => ({
                brands: removeRows(state.brands, ids),
            })),

            // ── Pages ───────────────────────────────────────────────────────
            updatePage: (id, updates) => set((state) => ({
                pages: patchRow(state.pages, id, (row) => ({ ...row, ...updates })),
            })),

            deletePages: (ids) => set((state) => ({
                pages: removeRows(state.pages, ids),
            })),

            // ── Attributes ──────────────────────────────────────────────────
            addAttribute: (input) => set((state) => {
                const record: ProductAttribute = { ...input, id: newId("attr"), ...stampCreated() };
                return { attributes: [record, ...state.attributes] };
            }),

            updateAttribute: (id, updates) => set((state) => ({
                attributes: patchRow(state.attributes, id, (row) => ({ ...row, ...updates })),
            })),

            deleteAttributes: (ids) => set((state) => ({
                attributes: removeRows(state.attributes, ids),
            })),

            // ── Specification groups ────────────────────────────────────────
            addSpecGroup: (input) => set((state) => {
                const record: SpecGroup = { ...input, id: newId("spec"), ...stampCreated() };
                return { specGroups: [record, ...state.specGroups] };
            }),

            updateSpecGroup: (id, updates) => set((state) => ({
                specGroups: patchRow(state.specGroups, id, (row) => ({ ...row, ...updates })),
            })),

            deleteSpecGroups: (ids) => set((state) => ({
                specGroups: removeRows(state.specGroups, ids),
            })),

            // ── Warranty Care Text library ──────────────────────────────────
            addWarrantyCareText: (input) => set((state) => {
                const record: WarrantyCareText = { ...input, id: newId("wct"), ...stampCreated() };
                return { warrantyCareTexts: [record, ...state.warrantyCareTexts] };
            }),

            updateWarrantyCareText: (id, updates) => set((state) => ({
                warrantyCareTexts: patchRow(state.warrantyCareTexts, id, (row) => ({ ...row, ...updates })),
            })),

            deleteWarrantyCareTexts: (ids) => set((state) => {
                const idsInUse = state.products
                    .map((product) => product.warranty.warrantyCareTextId)
                    .filter((textId): textId is string => textId !== null);
                const removableIds = ids.filter((id) => !idsInUse.includes(id));
                return { warrantyCareTexts: removeRows(state.warrantyCareTexts, removableIds) };
            }),

        }),
        { name: "erp-products-storage-v2" }
    )
);
