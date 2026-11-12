"use client";
import { useCallback, useMemo } from "react";
import { useGenericEntityStore, GenericEntity } from "@/store/useGenericEntityStore";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { ProductCareOption, WarrantyCareText } from "@/types/products";

// LAYER 3: Dropdown sources and guarded actions shared by the product drawers.

/** Module key the /admin/care page stores its records under. */
const CARE_MODULE_KEY = "care";

const readText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/**
 * Care records are schemaless. Records created on the Care page carry `title`,
 * while the records it was seeded with carry `name`, so both are read.
 */
function toCareOption(entity: GenericEntity): ProductCareOption | null {
    const label = readText(entity.title) || readText(entity.name);
    if (!label) {
        return null;
    }
    return { id: entity.id, label, inactive: readText(entity.status) === "Inactive" };
}

/** Care plans selectable on a product, read live from the /admin/care page data. */
export function useProductCareOptions(): ProductCareOption[] {
    const careEntities = useGenericEntityStore((state) => state.entities[CARE_MODULE_KEY]);

    return useMemo(() => {
        if (!careEntities) {
            return [];
        }
        return careEntities
            .map(toCareOption)
            .filter((option): option is ProductCareOption => option !== null);
    }, [careEntities]);
}

/** Warranty Care Text library entries, plus a lookup for the text a product points at. */
export function useWarrantyCareTextOptions() {
    const warrantyCareTexts = useGlobalProductsStore((state) => state.warrantyCareTexts);

    const activeTexts = useMemo(
        () => warrantyCareTexts.filter((item) => item.status === "Active"),
        [warrantyCareTexts]
    );

    const findText = useCallback((id: string | null): WarrantyCareText | null => {
        if (!id) {
            return null;
        }
        return warrantyCareTexts.find((item) => item.id === id) ?? null;
    }, [warrantyCareTexts]);

    return { warrantyCareTexts, activeTexts, findText };
}

/** Brand, category and attribute names for product form dropdowns, read from their own pages. */
export function useCatalogNames() {
    const brands = useGlobalProductsStore((state) => state.brands);
    const categories = useGlobalProductsStore((state) => state.categories);
    const attributes = useGlobalProductsStore((state) => state.attributes);

    const brandNames = useMemo(
        () => brands.filter((brand) => brand.status === "Active").map((brand) => brand.name),
        [brands]
    );
    const categoryNames = useMemo(
        () => categories.filter((category) => category.status === "Active").map((category) => category.name),
        [categories]
    );
    const attributeNames = useMemo(() => attributes.map((attribute) => attribute.name), [attributes]);

    return { brandNames, categoryNames, attributeNames };
}

/** Number of products using each Warranty Care Text, keyed by text id. */
export function useWarrantyCareTextUsage(): Record<string, number> {
    const products = useGlobalProductsStore((state) => state.products);

    return useMemo(() => {
        const usage: Record<string, number> = {};
        products.forEach((product) => {
            const textId = product.warranty.warrantyCareTextId;
            if (textId) {
                usage[textId] = (usage[textId] ?? 0) + 1;
            }
        });
        return usage;
    }, [products]);
}
