"use client";
import { useCallback, useMemo } from "react";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { BarcodeProductChoice, BarcodeFilterOption } from "@/types/barcodes";

// Product / variant choices for Create Barcode and the Print "create it here" prompt.
// Reads the live Products catalogue, so new products appear without code changes.

export function useBarcodeProductOptions() {
    const products = useGlobalProductsStore((state) => state.products);

    const productOptions: BarcodeFilterOption[] = useMemo(
        () => products.map((product) => ({ value: product.id, label: product.name })),
        [products],
    );

    const getVariantOptions = useCallback((productId: string): BarcodeFilterOption[] => {
        const product = products.find((item) => item.id === productId);
        return product ? product.variants.map((variant) => ({ value: variant.id, label: variant.title })) : [];
    }, [products]);

    /** Product + variant as a barcode needs them; null when either id is unknown. */
    const resolveChoice = useCallback((productId: string, variantId: string): BarcodeProductChoice | null => {
        const product = products.find((item) => item.id === productId);
        const variant = product?.variants.find((item) => item.id === variantId);
        if (!product || !variant) {
            return null;
        }
        return {
            productId: product.id,
            productName: product.name,
            variant: variant.title,
            sku: variant.sku,
            image: product.image,
            mrp: variant.maxRetailPrice,
        };
    }, [products]);

    return { productOptions, getVariantOptions, resolveChoice };
}
