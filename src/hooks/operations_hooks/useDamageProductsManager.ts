import { useCallback } from "react";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useDamageProductStore } from "@/store/useDamageProductStore";
import { DamageProduct } from "@/types/damageProducts";
import { OperationApprovalStatus } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";
import { useSpokeDrawers } from "./useSpokeDrawers";

const matches = (row: DamageProduct, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.ref, row.shop, row.status, row.date, row.note].some((text) => text.toLowerCase().includes(q))
        || row.serials.some((serial) => serial.serialNo.toLowerCase().includes(q));
};

/** Damage Products spoke: list, search, pagination, drawers and the approve / cancel decision. */
export function useDamageProductsManager() {
    const damageProducts = useDamageProductStore((state) => state.damageProducts);
    const setDamageStatus = useDamageProductStore((state) => state.setDamageStatus);
    const table = useListControls(damageProducts, matches);
    const drawers = useSpokeDrawers("view-damage-product", "create-damage-product");

    const viewed = damageProducts.find((item) => item.id === drawers.viewId) ?? null;

    const decide = useCallback((id: string, status: Exclude<OperationApprovalStatus, "Draft">) => {
        notifyOperationResult(setDamageStatus(id, status), `Damage record ${status === "Approved" ? "approved" : "cancelled"}.`);
    }, [setDamageStatus]);

    return { table, drawers, viewed, decide };
}
