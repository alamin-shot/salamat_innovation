import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DamageProduct, DamageProductState } from "@/types/damageProducts";
import { INITIAL_DAMAGE_PRODUCTS } from "@/mocks/damageProducts.mock";
import { OPERATIONS_AUDIT_ACTOR } from "@/constants/operations";
import { canDecide, nextOperationRef, serialListError } from "@/utils/operationsRules";

// LAYER 2: Damage Products optimistic cache (future /api/damage-products). Isolated from the other Operations spokes.

export const useDamageProductStore = create<DamageProductState>()(
    persist(
        (set, get) => ({
            damageProducts: INITIAL_DAMAGE_PRODUCTS as DamageProduct[],

            addDamageProduct: (input) => {
                if (!input.shop) return { ok: false, error: "shop_required" };
                if (!input.date) return { ok: false, error: "date_required" };
                const serialError = serialListError(input.serials);
                if (serialError) return { ok: false, error: serialError };

                const record: DamageProduct = {
                    ...input,
                    id: `dmg-${Date.now()}`,
                    ref: nextOperationRef("DMG", get().damageProducts.map((item) => item.ref)),
                    createdAt: new Date().toISOString(),
                    createdBy: OPERATIONS_AUDIT_ACTOR,
                    approvedBy: null,
                    status: "Draft",
                };
                set((state) => ({ damageProducts: [record, ...state.damageProducts] }));
                return { ok: true, id: record.id, ref: record.ref };
            },

            setDamageStatus: (id, status) => {
                const target = get().damageProducts.find((item) => item.id === id);
                if (!target) return { ok: false, error: "not_found" };
                if (!canDecide(target.status)) return { ok: false, error: "not_draft" };
                set((state) => ({
                    damageProducts: state.damageProducts.map((item) => (
                        item.id === id ? { ...item, status, approvedBy: OPERATIONS_AUDIT_ACTOR } : item
                    )),
                }));
                return { ok: true };
            },
        }),
        { name: "erp-damage-products-storage-v1" }
    )
);
