import { useState } from "react";
import { VariantDraftStore } from "@/types/products";
import { createVariantDraftStore } from "@/store/variantDraftStore";

/** One draft store per mounted form; the form's `key` gives every product a fresh one. */
export function useVariantDrafts(): VariantDraftStore {
    const [store] = useState(createVariantDraftStore);
    return store;
}
