export type ProductStatus = "Active" | "Inactive" | "Coming Soon" | "Arrival";

export interface Product {
    id: string;
    name: string;
    image?: string;
    category: string;
    brand: string;
    status: ProductStatus;
    ecommerce: boolean;
    tags?: string[];
    warrantyActive?: boolean;
    createdAt: string;
}