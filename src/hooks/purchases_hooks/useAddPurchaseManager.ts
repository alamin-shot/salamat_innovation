"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseLocation } from "@/types/purchases";
import { EMPTY_PURCHASE_COSTING, PURCHASE_FORM_ERRORS } from "@/constants/purchases";
import { serialKey } from "@/utils/purchaseMath";
import { serialOwners, unitToLineItem } from "@/utils/purchaseUnits";
import { usePartyResolver } from "@/hooks/people_hooks/usePartyResolver";
import { useSupplierOptions } from "@/hooks/people_hooks/useSupplierOptions";
import { PersonRecord } from "@/types/people";
import { usePurchaseLinesDraft } from "./usePurchaseLinesDraft";
import { usePurchaseUnitSearch } from "./usePurchaseUnitSearch";
import { useReceivePurchasedUnits } from "./useReceivePurchasedUnits";

const PURCHASE_LIST_PATH = "/admin/purchases/purchases";

export function useAddPurchaseManager() {
    const { openView, activeModal, closeView } = useCommandParams();
    const router = useRouter();
    const purchases = useGlobalPurchasesStore((state) => state.purchases);
    const addPurchase = useGlobalPurchasesStore((state) => state.addPurchase);
    const receiveUnits = useReceivePurchasedUnits();
    const resolveSupplier = usePartyResolver("supplier");

    // Form Meta State
    const [supplier, setSupplier] = useState("");
    const supplierOptions = useSupplierOptions(supplier);
    const [date, setDate] = useState("2026-10-12");
    /** Required: where the purchased units are received (same locations as Barcodes). */
    const [location, setLocation] = useState<PurchaseLocation | null>(null);

    // Manual Entry Toggle & State (units without a barcode yet)
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [manualProduct, setManualProduct] = useState("");
    const [manualVariant, setManualVariant] = useState("");
    const [manualSerial, setManualSerial] = useState("");

    // Rows (one unit each) + costing; Subtotal - Discount + Tax (manual amount) + Shipping = Total.
    const lines = usePurchaseLinesDraft([], EMPTY_PURCHASE_COSTING);

    const search = usePurchaseUnitSearch({
        mode: "purchase",
        items: lines.items,
        supplier: null,
        excludeId: null,
        onAdd: (option) => lines.appendItem(unitToLineItem(option)),
    });

    const openAddSupplierModal = () => openView("modal", "add-supplier");
    const isAddSupplierOpen = activeModal === "add-supplier";
    /** A supplier created from this form is selected straight away. */
    const handleSupplierCreated = (person: PersonRecord) => {
        setSupplier(person.name);
        closeView();
    };
    const toggleManualEntry = () => setIsManualEntryOpen((prev) => !prev);

    const handleSuggestSerial = () => {
        const randomSerial = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join("");
        setManualSerial(randomSerial);
    };

    const handleApplyManualItem = () => {
        if (!manualProduct || !manualVariant || !manualSerial.trim()) {
            toast.error("Please fill all manual entry fields");
            return;
        }
        const key = serialKey(manualSerial);
        if (lines.items.some((item) => serialKey(item.serial) === key)) {
            toast.error(`Cannot add: Serial/IMEI ${manualSerial.trim()} is already in this list.`);
            return;
        }
        const owner = serialOwners(purchases, null).get(key);
        if (owner) {
            toast.error(`Cannot add: Serial/IMEI ${manualSerial.trim()} was already purchased on ${owner}.`);
            return;
        }
        lines.appendItem({
            id: crypto.randomUUID(),
            barcodeId: null,
            productName: manualProduct,
            variant: manualVariant,
            sku: `SKU-${Math.floor(Math.random() * 10000)}`,
            serial: manualSerial.trim(),
            unitPrice: 0,
            quantity: 1,
        });
        setManualProduct("");
        setManualVariant("");
        setManualSerial("");
        toast.success("Item added to queue");
    };

    const handleSavePurchase = () => {
        if (!supplier) return toast.error(PURCHASE_FORM_ERRORS.supplier_required);
        if (!location) return toast.error(PURCHASE_FORM_ERRORS.location_required);
        if (!date) return toast.error(PURCHASE_FORM_ERRORS.date_required);
        if (lines.items.length === 0) return toast.error("Queue is empty");

        const result = addPurchase({ supplierId: resolveSupplier({ name: supplier, businessName: supplier }), supplier, date, location, items: lines.items, costing: lines.costing });
        if (!result.ok) {
            return toast.error(PURCHASE_FORM_ERRORS[result.error]);
        }
        receiveUnits(lines.items, { supplier, location, invoiceNumber: result.invoiceNumber });
        toast.success(`Purchase ${result.invoiceNumber} saved successfully!`);
        router.push(PURCHASE_LIST_PATH);
    };

    return {
        supplier, setSupplier, supplierOptions,
        date, setDate,
        location, setLocation,
        isManualEntryOpen, toggleManualEntry,
        manualProduct, setManualProduct,
        manualVariant, setManualVariant,
        manualSerial, setManualSerial,
        ...lines,
        search,
        openAddSupplierModal,
        isAddSupplierOpen,
        closeAddSupplier: closeView,
        handleSupplierCreated,
        handleSuggestSerial,
        handleApplyManualItem,
        handleSavePurchase,
    };
}
