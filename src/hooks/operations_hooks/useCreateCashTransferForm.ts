import { useState } from "react";
import { useCashTransferStore } from "@/store/useCashTransferStore";
import { OperationsShop } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";

const today = () => new Date().toISOString().slice(0, 10);

/** Create Cash Transfer form. The amount is kept as typed text and parsed on submit. */
export function useCreateCashTransferForm(onCreated: () => void) {
    const addCashTransfer = useCashTransferStore((state) => state.addCashTransfer);
    const [fromShop, setFromShop] = useState<OperationsShop | null>(null);
    const [toShop, setToShop] = useState<OperationsShop | null>(null);
    const [amountText, setAmountText] = useState("");
    const [date, setDate] = useState(today);
    const [note, setNote] = useState("");

    const amount = Number(amountText);

    const submit = () => {
        if (!fromShop || !toShop) {
            notifyOperationResult({ ok: false, error: "shop_required" }, "");
            return;
        }
        const result = addCashTransfer({ fromShop, toShop, amount, date, note: note.trim() });
        if (notifyOperationResult(result, result.ok ? `Cash transfer ${result.ref} created as Draft.` : "")) {
            onCreated();
        }
    };

    return { fromShop, setFromShop, toShop, setToShop, amountText, setAmountText, amount, date, setDate, note, setNote, submit };
}
