import { OfferProduct, OfferProductView } from "@/types/offers";
import { Product } from "@/types/products";
import { computeDiscount } from "@/utils/productRules";

/** Joins an offer product with its live Products variant; discount follows the Products rule (MRP − selling). */
export function viewOfferProduct(row: OfferProduct, products: Product[]): OfferProductView {
    const product = products.find((candidate) => candidate.id === row.productId);
    const variant = product?.variants.find((candidate) => candidate.id === row.variantId);
    if (!product || !variant) {
        return { ...row, isAvailable: false, maxRetailPrice: null, sellingPrice: null, discountAmount: 0, discountPercent: 0, discountState: "unavailable" };
    }
    const discount = computeDiscount(variant.maxRetailPrice, variant.sellingPrice);
    return {
        ...row,
        productName: product.name,
        variantName: variant.title,
        sku: variant.sku,
        isAvailable: true,
        maxRetailPrice: variant.maxRetailPrice,
        sellingPrice: variant.sellingPrice,
        discountAmount: discount.amount,
        discountPercent: discount.percent,
        discountState: discount.state,
    };
}
