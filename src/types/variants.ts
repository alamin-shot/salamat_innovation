export interface VariantAttribute {
    id: string;
    name: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    title: string;
    sku: string;
    maxRetailPrice: number | string;
    discountPercent: number | string;
    discountFixed: number | string;
    inStock: boolean;
}

export interface VariantsManagerProps {
    productId?: string | null;
}