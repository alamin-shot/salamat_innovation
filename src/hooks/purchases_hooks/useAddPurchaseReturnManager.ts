"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseUnitOption } from "@/types/purchases";
import { EMPTY_PURCHASE_COSTING, PURCHASE_FORM_ERRORS } from "@/constants/purchases";
import { unitToLineItem } from "@/utils/purchaseUnits";
import { usePartyResolver } from "@/hooks/people_hooks/usePartyResolver";
import { usePurchaseLinesDraft } from "./usePurchaseLinesDraft";
import { usePurchaseUnitSearch } from "./usePurchaseUnitSearch";

const RETURN_LIST_PATH = "/admin/purchases/purchase-return";

export function useAddPurchaseReturnManager() {
    const router = useRouter();
    const addPurchaseReturn = useGlobalPurchasesStore((state) => state.addPurchaseReturn);
    const resolveSupplier = usePartyResolver("supplier");

    const [date, setDate] = useState("2026-10-12");
    const lines = usePurchaseLinesDraft([], EMPTY_PURCHASE_COSTING);

    // "Auto-filled upon searching": the first unit added sets the supplier; an empty list clears it.
    const [firstSupplier, setFirstSupplier] = useState<string | null>(null);
    const supplier = lines.items.length > 0 ? firstSupplier : null;

    const handleAdd = (option: PurchaseUnitOption) => {
        if (lines.items.length === 0) {
            setFirstSupplier(option.supplier);
        }
        lines.appendItem(unitToLineItem(option));
    };

    // Only in-stock units (Received / Transferred) bought from that supplier.
    const search = usePurchaseUnitSearch({ mode: "return", items: lines.items, supplier, excludeId: null, onAdd: handleAdd });

    const handleSaveReturn = () => {
        if (lines.items.length === 0 || !supplier) return toast.error("Return queue is empty");
        if (!date) return toast.error(PURCHASE_FORM_ERRORS.date_required);

        // A new return is fully due: Due Amount = Total.
        const result = addPurchaseReturn({ supplierId: resolveSupplier({ name: supplier, businessName: supplier }), supplier, company: supplier, date, items: lines.items, costing: lines.costing });
        if (!result.ok) {
            return toast.error(PURCHASE_FORM_ERRORS[result.error]);
        }
        toast.success(`Purchase return ${result.invoiceNumber} saved successfully!`);
        router.push(RETURN_LIST_PATH);
    };

    return {
        date, setDate,
        supplier,
        ...lines,
        search,
        handleSaveReturn,
    };
}
