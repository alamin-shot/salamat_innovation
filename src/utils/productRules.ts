import { DiscountResult, Product, ProductVariant, ProductVariantEdit, ProductVariantOption } from "@/types/products";

const NO_DISCOUNT: Omit<DiscountResult, "state"> = { amount: 0, percent: 0 };

/**
 * Discount derived from the price comparison (MRP vs. Selling Price).
 * Replaces the manual "Discount %" / "Fixed Discount" inputs.
 */
export function computeDiscount(maxRetailPrice: number | null, sellingPrice: number | null): DiscountResult {
    if (maxRetailPrice === null || sellingPrice === null) {
        return { state: "incomplete", ...NO_DISCOUNT };
    }
    if (!Number.isFinite(maxRetailPrice) || !Number.isFinite(sellingPrice) || maxRetailPrice <= 0 || sellingPrice < 0) {
        return { state: "incomplete", ...NO_DISCOUNT };
    }
    if (sellingPrice > maxRetailPrice) {
        return { state: "selling_above_mrp", ...NO_DISCOUNT };
    }
    if (sellingPrice === maxRetailPrice) {
        return { state: "none", ...NO_DISCOUNT };
    }

    const amount = Math.round((maxRetailPrice - sellingPrice) * 100) / 100;
    const percent = Math.round((amount / maxRetailPrice) * 10000) / 100;
    return { state: "discounted", amount, percent };
}

/** True only for an attribute named "Color" or "Colour", in any letter case. */
export function isColorAttribute(attributeName: string): boolean {
    return /^colou?r$/i.test(attributeName.trim());
}

/** DD-MM-YYYY, the date format the Products tables already display. */
export function formatAuditDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
}

/** Converts a price input's text to a number; empty or invalid text becomes null. */
export function parsePriceInput(value: string): number | null {
    const trimmed = value.trim();
    if (trimmed === "") {
        return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
}

/** Text for a price input; null becomes an empty field. */
export function toPriceInput(value: number | null): string {
    return value === null ? "" : String(value);
}

/** ৳ amount in the format the Products tables already use. */
export function formatTaka(amount: number): string {
    return `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

/** Splits incoming items into those that fit under `limit` and the count that does not. */
export function takeWithinLimit<T>(currentCount: number, incoming: T[], limit: number): { accepted: T[]; rejected: number } {
    const remaining = Math.max(0, limit - currentCount);
    const accepted = incoming.slice(0, remaining);
    return { accepted, rejected: incoming.length - accepted.length };
}

interface VariantOptionShape {
    name: string;
    values: string[];
}

interface VariantRowShape {
    id: string;
    title: string;
    sku: string;
    maxRetailPrice: number | null;
    sellingPrice: number | null;
    inStock: boolean;
}

/**
 * One variant row per combination of option values (e.g. "128GB / Gold").
 * Rows that already exist keep their SKU, prices and stock flag.
 */
export function buildVariantRows<T extends VariantRowShape>(options: VariantOptionShape[], existing: T[], create: (title: string) => T): T[] {
    const validOptions = options.filter((option) => option.name && option.values.length > 0);
    if (validOptions.length === 0) {
        return [];
    }
    const combinations = validOptions.reduce<string[][]>(
        (acc, option) => acc.flatMap((combo) => option.values.map((value) => [...combo, value])),
        [[]]
    );
    return combinations.map((combo) => {
        const title = combo.join(" / ");
        return existing.find((row) => row.title === title) ?? create(title);
    });
}

/** True when any variant is priced above its MRP. */
export function hasVariantPriceAboveMrp(variants: { maxRetailPrice: number | null; sellingPrice: number | null }[]): boolean {
    return variants.some((variant) => computeDiscount(variant.maxRetailPrice, variant.sellingPrice).state === "selling_above_mrp");
}

// ── Inline variant editing ──────────────────────────────────────────────────

/** The editable fields of a saved variant. */
export function pickVariantEdit(variant: ProductVariant): ProductVariantEdit {
    return {
        sku: variant.sku,
        maxRetailPrice: variant.maxRetailPrice,
        sellingPrice: variant.sellingPrice,
        inStock: variant.inStock,
        isPrebook: variant.isPrebook,
    };
}

/** Applies `changes`. In Stock and Prebook are exclusive: switching one on switches the other off. */
export function applyVariantEdit(current: ProductVariantEdit, changes: Partial<ProductVariantEdit>): ProductVariantEdit {
    const next = { ...current, ...changes };
    if (changes.isPrebook === true) {
        next.inStock = false;
    }
    if (changes.inStock === true) {
        next.isPrebook = false;
    }
    return next;
}

export function isSameVariantEdit(a: ProductVariantEdit, b: ProductVariantEdit): boolean {
    return a.sku === b.sku
        && a.maxRetailPrice === b.maxRetailPrice
        && a.sellingPrice === b.sellingPrice
        && a.inStock === b.inStock
        && a.isPrebook === b.isPrebook;
}

/** Rows with their unsaved edits applied. */
export function mergeVariantDrafts(rows: ProductVariant[], drafts: Record<string, ProductVariantEdit>): ProductVariant[] {
    return rows.map((row) => {
        const draft = drafts[row.id];
        if (draft) {
            return { ...row, ...draft };
        }
        return row;
    });
}

/** Same attributes, values (in order) and colour images. */
export function areVariantOptionsEqual(a: ProductVariantOption[], b: ProductVariantOption[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    return a.every((option, index) => {
        const other = b[index];
        const imageKeys = Object.keys(option.valueImages);
        return option.id === other.id
            && option.name === other.name
            && option.values.length === other.values.length
            && option.values.every((value, i) => value === other.values[i])
            && imageKeys.length === Object.keys(other.valueImages).length
            && imageKeys.every((key) => option.valueImages[key] === other.valueImages[key]);
    });
}

/**
 * Image of the variant's colour value, e.g. "Gold" in "128GB / Gold".
 * Titles list values in builder order (see buildVariantRows), so the colour is
 * found by the colour option's position among the options that have values.
 */
export function variantSwatchImage(options: ProductVariantOption[], title: string): string | null {
    const validOptions = options.filter((option) => option.name && option.values.length > 0);
    const colorIndex = validOptions.findIndex((option) => isColorAttribute(option.name));
    if (colorIndex < 0) {
        return null;
    }
    const value = title.split(" / ")[colorIndex];
    return value ? validOptions[colorIndex].valueImages[value] ?? null : null;
}

/** Fills fields added after a product was saved in the browser (persist migration). */
export function withVariantDefaults(product: Product): Product {
    return {
        ...product,
        variants: product.variants.map((variant) => ({ ...variant, isPrebook: variant.isPrebook ?? false })),
    };
}
