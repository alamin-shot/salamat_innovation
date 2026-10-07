import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    headline: z.string().optional(),
    brandId: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    keyFeatures: z.string().optional(),
    bookingMoney: z.coerce.number().optional(),
    purchasePoint: z.coerce.number().optional(),
    warrantyText: z.string().optional(),
    serviceWarranty: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;