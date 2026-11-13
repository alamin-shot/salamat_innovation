"use client";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { BarcodeGenerateItem, BarcodeLocation, BarcodeSerialMode, BarcodeStagedItem } from "@/types/barcodes";
import { BARCODES_AUDIT_ACTOR } from "@/constants/barcodes";
import { normalizeSerial } from "@/utils/barcodeRules";
import { parsePriceInput } from "@/utils/productRules";
import { useBarcodeProductOptions } from "./useBarcodeProductOptions";

// LAYER 3: Create Barcode. Stages product variants in a queue, then generates
// barcodes into the store with either auto (SKU-YYYYMMDD-0001) or typed / scanned serials.

let stagedSequence = 0;
const newStagedId = (): string => `stg-${Date.now()}-${++stagedSequence}`;

export function useCreateBarcodeManager() {
    const { productOptions, getVariantOptions, resolveChoice } = useBarcodeProductOptions();

    const [selectedProductId, setSelectedProductIdState] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [location, setLocation] = useState<BarcodeLocation | "">("");
    const [stagedItems, setStagedItems] = useState<BarcodeStagedItem[]>([]);

    const variantOptions = useMemo(
        () => (selectedProductId ? getVariantOptions(selectedProductId) : []),
        [selectedProductId, getVariantOptions],
    );

    // A new product invalidates the chosen variant.
    const setSelectedProductId = useCallback((productId: string) => {
        setSelectedProductIdState(productId);
        setSelectedVariantId("");
    }, []);

    const patchItem = useCallback((id: string, change: (item: BarcodeStagedItem) => BarcodeStagedItem) => {
        setStagedItems((prev) => prev.map((item) => (item.id === id ? change(item) : item)));
    }, []);

    // ── Queue ───────────────────────────────────────────────────────────────
    const handleAddToQueue = useCallback(() => {
        const choice = resolveChoice(selectedProductId, selectedVariantId);
        if (!choice) {
            toast.error("Please select both a product and an attribute.");
            return;
        }

        const existing = stagedItems.find((item) => (
            item.productId === choice.productId && item.variant === choice.variant && item.serialMode === "auto"
        ));
        if (existing) {
            patchItem(existing.id, (item) => ({ ...item, quantity: item.quantity + 1 }));
            toast.success("Quantity increased in the generation queue");
        } else {
            setStagedItems((prev) => [...prev, {
                ...choice,
                id: newStagedId(),
                mrpText: choice.mrp === null ? "" : String(choice.mrp),
                quantity: 1,
                serialMode: "auto",
                manualSerials: [],
            }]);
            toast.success("Added to generation queue");
        }
        setSelectedProductIdState("");
        setSelectedVariantId("");
    }, [resolveChoice, selectedProductId, selectedVariantId, stagedItems, patchItem]);

    const handleRemoveFromQueue = useCallback((id: string) => {
        setStagedItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleQuantityChange = useCallback((id: string, quantity: number) => {
        if (!Number.isInteger(quantity) || quantity < 1) {
            return;
        }
        // In manual mode the quantity is the number of serials entered.
        patchItem(id, (item) => (item.serialMode === "manual" ? item : { ...item, quantity }));
    }, [patchItem]);

    const handleSkuChange = useCallback((id: string, sku: string) => {
        patchItem(id, (item) => ({ ...item, sku }));
    }, [patchItem]);

    const handleMrpChange = useCallback((id: string, mrpText: string) => {
        patchItem(id, (item) => ({ ...item, mrpText }));
    }, [patchItem]);

    const handleSerialModeChange = useCallback((id: string, serialMode: BarcodeSerialMode) => {
        patchItem(id, (item) => {
            if (item.serialMode === serialMode) {
                return item;
            }
            return serialMode === "manual"
                ? { ...item, serialMode, manualSerials: [], quantity: 0 }
                : { ...item, serialMode, manualSerials: [], quantity: 1 };
        });
    }, [patchItem]);

    /** Adds one typed / scanned serial. Returns true when it was accepted. */
    const handleAddManualSerial = useCallback((id: string, raw: string): boolean => {
        const serial = normalizeSerial(raw);
        if (!serial) {
            return false;
        }
        const inStore = useGlobalBarcodesStore.getState().barcodes.some((barcode) => normalizeSerial(barcode.serialNumber) === serial);
        if (inStore) {
            toast.error(`Serial ${serial} already exists.`);
            return false;
        }
        if (stagedItems.some((item) => item.manualSerials.includes(serial))) {
            toast.error(`Serial ${serial} is already in the queue.`);
            return false;
        }
        patchItem(id, (item) => {
            const manualSerials = [...item.manualSerials, serial];
            return { ...item, manualSerials, quantity: manualSerials.length };
        });
        return true;
    }, [stagedItems, patchItem]);

    const handleRemoveManualSerial = useCallback((id: string, serial: string) => {
        patchItem(id, (item) => {
            const manualSerials = item.manualSerials.filter((value) => value !== serial);
            return { ...item, manualSerials, quantity: manualSerials.length };
        });
    }, [patchItem]);

    // ── Generate ────────────────────────────────────────────────────────────
    const totalUnits = stagedItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleGenerateBarcodes = useCallback(() => {
        if (stagedItems.length === 0) {
            toast.error("No items in queue to generate.");
            return;
        }
        if (!location) {
            toast.error("Please select a location for these barcodes.");
            return;
        }

        const generate = useGlobalBarcodesStore.getState().generateBarcodes;
        const keep: BarcodeStagedItem[] = [];
        let created = 0;

        // Item by item, so a row that fails stays in the queue for correction.
        stagedItems.forEach((item) => {
            const mrp = parsePriceInput(item.mrpText);
            if (item.mrpText.trim() !== "" && (mrp === null || mrp < 0)) {
                toast.error(`${item.productName}: enter a valid retail price.`);
                keep.push(item);
                return;
            }
            const input: BarcodeGenerateItem = {
                productId: item.productId,
                productName: item.productName,
                variant: item.variant,
                sku: item.sku.trim(),
                image: item.image,
                mrp,
                quantity: item.quantity,
                serialMode: item.serialMode,
                manualSerials: item.manualSerials,
            };
            const result = generate([input], location, BARCODES_AUDIT_ACTOR);
            created += result.applied.length;
            if (result.rejected.length > 0) {
                result.rejected.forEach((rejection) => toast.error(`${item.productName}: ${rejection.reason}`));
                keep.push(item);
            }
        });

        setStagedItems(keep);
        if (created > 0) {
            toast.success(`Generated ${created} barcode${created === 1 ? "" : "s"} at ${location}.`);
        }
    }, [stagedItems, location]);

    return {
        // Selection
        productOptions,
        variantOptions,
        selectedProductId,
        setSelectedProductId,
        selectedVariantId,
        setSelectedVariantId,
        location,
        setLocation,

        // Queue
        stagedItems,
        totalUnits,
        handleAddToQueue,
        handleRemoveFromQueue,
        handleQuantityChange,
        handleSkuChange,
        handleMrpChange,
        handleSerialModeChange,
        handleAddManualSerial,
        handleRemoveManualSerial,

        handleGenerateBarcodes,
    };
}

export type CreateBarcodeManager = ReturnType<typeof useCreateBarcodeManager>;
