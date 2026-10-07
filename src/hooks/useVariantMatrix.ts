import { useState, useEffect, useCallback } from "react";
import { VariantAttribute, ProductVariant } from "@/types/variants";

export function useVariantMatrix() {
    const [attributes, setAttributes] = useState<VariantAttribute[]>([]);
    const [variants, setVariants] = useState<ProductVariant[]>([]);

    // The Auto-Generator function
    const generateVariants = useCallback(() => {
        if (attributes.length === 0 || attributes.every(a => a.values.length === 0)) {
            setVariants([]);
            return;
        }

        // Isolate valid attributes (must have a name and at least one value)
        const validAttrs = attributes.filter(a => a.name && a.values.length > 0);
        if (validAttrs.length === 0) return;

        // Cross-multiply arrays (Cartesian Product)
        const matrix = validAttrs.reduce<string[][]>(
            (acc, curr) => acc.flatMap(comb => curr.values.map(val => [...comb, val])),
            [[]]
        );

        const newVariants: ProductVariant[] = matrix.map((combination) => ({
            id: combination.join("-"),
            title: combination.join(" / "),
            sku: "",
            maxRetailPrice: "",
            discountPercent: "",
            discountFixed: "",
            inStock: true,
        }));

        setVariants(newVariants);
    }, [attributes]);

    // Regenerate the grid anytime an attribute changes
    useEffect(() => {
        generateVariants();
    }, [generateVariants]);

    const addAttribute = () => {
        setAttributes([...attributes, { id: crypto.randomUUID(), name: "", values: [] }]);
    };

    const updateAttribute = (id: string, field: keyof VariantAttribute, val: any) => {
        setAttributes(attributes.map(a => a.id === id ? { ...a, [field]: val } : a));
    };

    const removeAttribute = (id: string) => {
        setAttributes(attributes.filter(a => a.id !== id));
    };

    return {
        attributes,
        variants,
        setVariants,
        addAttribute,
        updateAttribute,
        removeAttribute
    };
}