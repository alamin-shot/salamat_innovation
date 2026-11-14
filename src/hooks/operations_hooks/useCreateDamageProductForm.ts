import { useState } from "react";
import { useDamageProductStore } from "@/store/useDamageProductStore";
import { DamagedSerial } from "@/types/damageProducts";
import { OperationSerial, OperationsShop } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";
import { useSerialScanner } from "./useSerialScanner";

const today = () => new Date().toISOString().slice(0, 10);

/** Scanned units are in stock, so their stock status is "Available" until the record is approved. */
const toDamagedSerial = (serial: OperationSerial): DamagedSerial => ({ ...serial, stockStatus: "Available" });

/** Record Damage form. Mounted fresh each time the drawer opens. */
export function useCreateDamageProductForm(onCreated: () => void) {
    const addDamageProduct = useDamageProductStore((state) => state.addDamageProduct);
    const [shop, setShop] = useState<OperationsShop | null>(null);
    const [date, setDate] = useState(today);
    const [note, setNote] = useState("");
    const scanner = useSerialScanner(toDamagedSerial);

    const submit = () => {
        if (!shop) {
            notifyOperationResult({ ok: false, error: "shop_required" }, "");
            return;
        }
        const result = addDamageProduct({ shop, date, note: note.trim(), serials: scanner.serials });
        if (notifyOperationResult(result, result.ok ? `Damage record ${result.ref} created as Draft.` : "")) {
            onCreated();
        }
    };

    return { shop, setShop, date, setDate, note, setNote, scanner, submit };
}
