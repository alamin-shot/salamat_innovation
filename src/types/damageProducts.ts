// LAYER 1: Damage Products (future NestJS resource: /api/damage-products).
import type {
    OperationApprovalStatus,
    OperationSerial,
    OperationsActionResult,
    OperationsCreateResult,
    OperationsShop,
} from "@/types/operations";

/** A damaged unit. `stockStatus` is the unit's stock state the view drawer shows ("Available"). */
export interface DamagedSerial extends OperationSerial {
    stockStatus: string;
}

export interface DamageProduct {
    id: string;
    /** "DMG-000002" */
    ref: string;
    shop: OperationsShop;
    /** YYYY-MM-DD */
    date: string;
    /** ISO 8601 */
    createdAt: string;
    createdBy: string;
    approvedBy: string | null;
    /** Note / reason entered on create. */
    note: string;
    status: OperationApprovalStatus;
    serials: DamagedSerial[];
}

export type DamageProductInput = Pick<DamageProduct, "shop" | "date" | "note" | "serials">;

export interface DamageProductState {
    damageProducts: DamageProduct[];
    addDamageProduct: (input: DamageProductInput) => OperationsCreateResult;
    setDamageStatus: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => OperationsActionResult;
}
