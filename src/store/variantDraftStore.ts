import { createStore } from "zustand/vanilla";
import { ProductVariant, ProductVariantEdit, VariantDraftState } from "@/types/products";
import { applyVariantEdit, isSameVariantEdit, pickVariantEdit } from "@/utils/productRules";

// Unsaved inline edits of ONE variants table. Created per form (see useVariantDrafts), never persisted:
// edits reach useGlobalProductsStore only through a row Save or Save All.
// Each row subscribes to its own entry, so typing re-renders that row alone.

/** Writes the edit, or removes the entry when the row is back to its saved values. */
function withEdit(drafts: Record<string, ProductVariantEdit>, baseline: ProductVariant, changes: Partial<ProductVariantEdit>): Record<string, ProductVariantEdit> {
    const saved = pickVariantEdit(baseline);
    const next = applyVariantEdit(drafts[baseline.id] ?? saved, changes);
    const result = { ...drafts };
    if (isSameVariantEdit(next, saved)) {
        delete result[baseline.id];
    } else {
        result[baseline.id] = next;
    }
    return result;
}

export const createVariantDraftStore = () => createStore<VariantDraftState>()((set) => ({
    drafts: {} as Record<string, ProductVariantEdit>,

    editVariant: (baseline, changes) => set((state) => ({
        drafts: withEdit(state.drafts, baseline, changes),
    })),

    setAllInStock: (baselines, inStock) => set((state) => ({
        drafts: baselines.reduce((drafts, baseline) => withEdit(drafts, baseline, { inStock }), state.drafts),
    })),

    discardVariant: (id) => set((state) => {
        if (!(id in state.drafts)) {
            return state;
        }
        const drafts = { ...state.drafts };
        delete drafts[id];
        return { drafts };
    }),

    pruneDrafts: (keepIds) => set((state) => {
        const keep = new Set(keepIds);
        const staleIds = Object.keys(state.drafts).filter((id) => !keep.has(id));
        if (staleIds.length === 0) {
            return state;
        }
        const drafts = { ...state.drafts };
        staleIds.forEach((id) => delete drafts[id]);
        return { drafts };
    }),
}));
