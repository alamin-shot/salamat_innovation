"use client";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { Barcode, BarcodeLocation, BarcodeMissingScan } from "@/types/barcodes";
import { BARCODES_AUDIT_ACTOR } from "@/constants/barcodes";
import { getPrintError, normalizeSerial } from "@/utils/barcodeRules";
import { parsePriceInput } from "@/utils/productRules";
import { useBarcodeProductOptions } from "./useBarcodeProductOptions";

// LAYER 3: Print Barcode. Scans resolve against the barcode store; printing
// logs a Printed event. Unknown serials can be created on the spot (POS flow).

export function usePrintQueueManager() {
    const barcodes = useGlobalBarcodesStore((state) => state.barcodes);
    const { productOptions, getVariantOptions, resolveChoice } = useBarcodeProductOptions();

    const [searchCode, setSearchCode] = useState("");
    const [queueIds, setQueueIds] = useState<string[]>([]);
    const [scanError, setScanError] = useState<string | null>(null);

    // "Not found -> create it here" panel
    const [missingScan, setMissingScan] = useState<BarcodeMissingScan | null>(null);
    const [missingProductId, setMissingProductIdState] = useState("");
    const [missingVariantId, setMissingVariantId] = useState("");
    const [missingLocation, setMissingLocation] = useState<BarcodeLocation | "">("");
    const [missingMrpText, setMissingMrpText] = useState("");

    /** Queue rows read live from the store, in scan order. */
    const printQueue: Barcode[] = useMemo(() => {
        const byId = new Map(barcodes.map((barcode) => [barcode.id, barcode]));
        return queueIds.flatMap((id) => {
            const barcode = byId.get(id);
            return barcode ? [barcode] : [];
        });
    }, [barcodes, queueIds]);

    const missingVariantOptions = useMemo(
        () => (missingProductId ? getVariantOptions(missingProductId) : []),
        [missingProductId, getVariantOptions],
    );

    const setMissingProductId = useCallback((productId: string) => {
        setMissingProductIdState(productId);
        setMissingVariantId("");
        setMissingMrpText("");
    }, []);

    const setMissingVariant = useCallback((variantId: string) => {
        setMissingVariantId(variantId);
        const choice = resolveChoice(missingProductId, variantId);
        setMissingMrpText(choice?.mrp === null || choice?.mrp === undefined ? "" : String(choice.mrp));
    }, [missingProductId, resolveChoice]);

    const dismissMissing = useCallback(() => {
        setMissingScan(null);
        setMissingProductIdState("");
        setMissingVariantId("");
        setMissingLocation("");
        setMissingMrpText("");
    }, []);

    const enqueue = useCallback((barcode: Barcode) => {
        setQueueIds((prev) => (prev.includes(barcode.id) ? prev : [...prev, barcode.id]));
    }, []);

    // ── Scan ────────────────────────────────────────────────────────────────
    const handleScan = useCallback((raw: string) => {
        const serial = normalizeSerial(raw);
        if (!serial) {
            return;
        }
        setSearchCode("");

        const barcode = useGlobalBarcodesStore.getState().barcodes
            .find((item) => normalizeSerial(item.serialNumber) === serial);

        if (!barcode) {
            setScanError(null);
            dismissMissing();
            setMissingScan({ serialNumber: serial });
            return;
        }

        const printError = getPrintError(barcode);
        if (printError) {
            setScanError(`${printError} (${barcode.serialNumber})`);
            toast.error(printError);
            return;
        }

        setScanError(null);
        if (queueIds.includes(barcode.id)) {
            toast.info(`${barcode.serialNumber} is already in the print queue.`);
            return;
        }
        enqueue(barcode);
        toast.success("Added to print queue");
    }, [queueIds, enqueue, dismissMissing]);

    // Scanners type the code and press Enter.
    const handleAddByCode = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleScan(e.currentTarget.value);
        }
    }, [handleScan]);

    // ── Create the missing barcode, then queue it ───────────────────────────
    const handleCreateMissing = useCallback(() => {
        if (!missingScan) {
            return;
        }
        const choice = resolveChoice(missingProductId, missingVariantId);
        if (!choice) {
            toast.error("Please select both a product and an attribute.");
            return;
        }
        if (!missingLocation) {
            toast.error("Please select a location.");
            return;
        }
        const mrp = parsePriceInput(missingMrpText);
        if (missingMrpText.trim() !== "" && (mrp === null || mrp < 0)) {
            toast.error("Enter a valid MRP.");
            return;
        }

        const result = useGlobalBarcodesStore.getState().generateBarcodes([{
            ...choice,
            mrp,
            quantity: 1,
            serialMode: "manual",
            manualSerials: [missingScan.serialNumber],
        }], missingLocation, BARCODES_AUDIT_ACTOR);

        const createdId = result.applied[0];
        if (!createdId) {
            result.rejected.forEach((rejection) => toast.error(rejection.reason));
            return;
        }
        setQueueIds((prev) => [...prev, createdId]);
        toast.success(`Barcode ${missingScan.serialNumber} created and added to the print queue.`);
        dismissMissing();
    }, [missingScan, missingProductId, missingVariantId, missingLocation, missingMrpText, resolveChoice, dismissMissing]);

    // ── Queue & print ───────────────────────────────────────────────────────
    const handleRemoveFromQueue = useCallback((id: string) => {
        setQueueIds((prev) => prev.filter((item) => item !== id));
    }, []);

    const handlePrint = useCallback(() => {
        if (printQueue.length === 0) {
            toast.error("No items in queue to print.");
            return;
        }
        const result = useGlobalBarcodesStore.getState().markPrinted(printQueue.map((barcode) => barcode.id), BARCODES_AUDIT_ACTOR);
        if (result.applied.length > 0) {
            toast.success(`Sending ${result.applied.length} barcode${result.applied.length === 1 ? "" : "s"} to the thermal printer...`);
        }
        result.rejected.forEach((rejection) => toast.error(rejection.reason));
        // Printed rows leave the queue; blocked ones stay so the user sees them.
        setQueueIds((prev) => prev.filter((id) => !result.applied.includes(id)));
    }, [printQueue]);

    return {
        searchCode,
        setSearchCode,
        scanError,
        printQueue,
        handleAddByCode,
        handleRemoveFromQueue,
        handlePrint,

        // Not-found panel
        missingScan,
        productOptions,
        missingVariantOptions,
        missingProductId,
        setMissingProductId,
        missingVariantId,
        setMissingVariant,
        missingLocation,
        setMissingLocation,
        missingMrpText,
        setMissingMrpText,
        handleCreateMissing,
        dismissMissing,
    };
}

export type PrintQueueManager = ReturnType<typeof usePrintQueueManager>;
