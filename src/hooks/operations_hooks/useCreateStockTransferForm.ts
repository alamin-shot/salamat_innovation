import { useState } from "react";
import { useStockTransferStore } from "@/store/useStockTransferStore";
import { OperationsShop } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";
import { useSerialScanner } from "./useSerialScanner";

const today = () => new Date().toISOString().slice(0, 10);

/** Create Stock Transfer form. Mounted fresh each time the drawer opens, so it always starts empty. */
export function useCreateStockTransferForm(onCreated: () => void) {
    const addTransfer = useStockTransferStore((state) => state.addTransfer);
    const [fromShop, setFromShop] = useState<OperationsShop | null>(null);
    const [toShop, setToShop] = useState<OperationsShop | null>(null);
    const [date, setDate] = useState(today);
    const [note, setNote] = useState("");
    const scanner = useSerialScanner((serial) => serial);

    const submit = () => {
        if (!fromShop || !toShop) {
            notifyOperationResult({ ok: false, error: "shop_required" }, "");
            return;
        }
        const result = addTransfer({ fromShop, toShop, date, note: note.trim(), serials: scanner.serials });
        if (notifyOperationResult(result, result.ok ? `Transfer ${result.ref} created as Draft.` : "")) {
            onCreated();
        }
    };

    return { fromShop, setFromShop, toShop, setToShop, date, setDate, note, setNote, scanner, submit };
}
