import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGlobalProductsStore } from "@/store/useGlobalProductsStore";
import { Offer, OfferInput, OfferProduct, OfferStatus, OfferType } from "@/types/offers";
import { viewOfferProduct } from "@/utils/offerRules";

const OFFER_TYPES: OfferType[] = ["Flash Sale", "Campaign", "Regular"];
const toDay = (iso: string) => iso.slice(0, 10);
const toIso = (day: string) => (day ? `${day}T00:00:00+06:00` : "");

const emptyOffer = (): OfferInput => {
    const now = new Date().toISOString();
    return { title: "", description: "", banner: null, startDate: now, endDate: now, type: "Flash Sale", status: "Active", products: [] };
};

/**
 * Add / Edit Offer. Products are picked from the Products store (product, then variant); their MRP,
 * selling price and discount are shown live from there. Mount with a key per offer.
 */
export function useOfferForm(existing: Offer | null, onSubmit: (data: OfferInput) => void) {
    const products = useGlobalProductsStore((state) => state.products);
    const [form, setForm] = useState<OfferInput>(() => (existing ? structuredClone({ ...existing }) : emptyOffer()));
    const [pickedProductId, setPickedProductId] = useState("");
    const [pickedVariantId, setPickedVariantId] = useState("");

    const productOptions = useMemo(() => products.map((product) => ({ value: product.id, label: product.name })), [products]);
    const pickedProduct = products.find((product) => product.id === pickedProductId) ?? null;
    const variantOptions = (pickedProduct?.variants ?? []).map((variant) => ({ value: variant.id, label: variant.sku ? `${variant.title} · ${variant.sku}` : variant.title }));

    const rows = useMemo(() => form.products.map((row) => viewOfferProduct(row, products)), [form.products, products]);

    const set = <K extends keyof OfferInput>(key: K, value: OfferInput[K]) => setForm((prev) => ({ ...prev, [key]: value }));

    const pickProduct = (id: string) => {
        setPickedProductId(id);
        const product = products.find((candidate) => candidate.id === id);
        // A product with a single variant is picked straight away.
        setPickedVariantId(product?.variants.length === 1 ? product.variants[0].id : "");
    };

    const addPicked = () => {
        const variant = pickedProduct?.variants.find((candidate) => candidate.id === pickedVariantId);
        if (!pickedProduct || !variant) return toast.error("Choose a product and a variant.");
        if (form.products.some((row) => row.productId === pickedProduct.id && row.variantId === variant.id)) {
            return toast.error("This variant is already in the offer.");
        }
        const row: OfferProduct = { id: `op-${Date.now()}`, productId: pickedProduct.id, variantId: variant.id, productName: pickedProduct.name, variantName: variant.title, sku: variant.sku };
        set("products", [...form.products, row]);
        setPickedProductId("");
        setPickedVariantId("");
    };

    const removeProduct = (rowId: string) => set("products", form.products.filter((row) => row.id !== rowId));

    const submit = () => {
        if (!form.title.trim()) return toast.error("Title is required.");
        onSubmit({ ...form, title: form.title.trim() });
    };

    return {
        form,
        setTitle: (value: string) => set("title", value),
        setDescription: (value: string) => set("description", value),
        startDay: toDay(form.startDate),
        endDay: toDay(form.endDate),
        setStartDay: (day: string) => set("startDate", toIso(day)),
        setEndDay: (day: string) => set("endDate", toIso(day)),
        setType: (value: string) => set("type", OFFER_TYPES.find((type) => type === value) ?? form.type),
        setStatus: (value: string) => set("status", (value === "Inactive" ? "Inactive" : "Active") satisfies OfferStatus),
        offerTypes: OFFER_TYPES,
        productOptions,
        variantOptions,
        pickedProductId,
        pickedVariantId,
        pickProduct,
        setPickedVariantId,
        addPicked,
        rows,
        removeProduct,
        submit,
    };
}

export type OfferForm = ReturnType<typeof useOfferForm>;
