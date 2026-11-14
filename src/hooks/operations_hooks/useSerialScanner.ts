import { useState } from "react";
import { toast } from "sonner";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { OperationSerial } from "@/types/operations";
import { lookupStockUnit } from "@/utils/operationsUnits";

/**
 * Scan box + staged list for Stock Transfer and Damage forms. Enter (or a barcode scanner, which
 * sends the serial followed by Enter) looks the unit up in Barcodes; a refusal explains why.
 */
export function useSerialScanner<T extends OperationSerial>(toRow: (serial: OperationSerial) => T) {
    const barcodes = useGlobalBarcodesStore((state) => state.barcodes);
    const [query, setQuery] = useState("");
    const [serials, setSerials] = useState<T[]>([]);

    const scan = () => {
        const result = lookupStockUnit(barcodes, query, serials);
        if (!result.ok) {
            toast.error(result.message);
            return;
        }
        setSerials((prev) => [...prev, toRow(result.serial)]);
        setQuery("");
    };

    const remove = (id: string) => setSerials((prev) => prev.filter((serial) => serial.id !== id));

    return { query, setQuery, serials, scan, remove };
}
