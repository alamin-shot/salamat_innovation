"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export interface StagedPurchaseItem {
    id: string;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    unitPrice: number;
    quantity: number;
}

export function useAddPurchaseManager() {
    const { openView } = useCommandParams();

    // Form Meta State
    const [supplier, setSupplier] = useState("");
    const [date, setDate] = useState("2026-10-12");

    // Manual Entry Toggle & State
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [manualProduct, setManualProduct] = useState("");
    const [manualVariant, setManualVariant] = useState("");
    const [manualSerial, setManualSerial] = useState("");

    // Queue State
    const [stagedItems, setStagedItems] = useState<StagedPurchaseItem[]>([]);

    // Financial State
    const [discountType, setDiscountType] = useState("");
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);

    // Modal Trigger & Toggle
    const openAddSupplierModal = () => openView("modal", "add-supplier");
    const toggleManualEntry = () => setIsManualEntryOpen(prev => !prev);

    // Math Engine
    const totals = useMemo(() => {
        const subTotal = stagedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        const calculatedDiscount = discountType === "Percentage"
            ? subTotal * (discountAmount / 100)
            : discountAmount;
        const calculatedTax = subTotal * (orderTaxPct / 100);
        const grandTotal = subTotal - calculatedDiscount + calculatedTax + shippingCost;

        return {
            subTotal,
            discount: calculatedDiscount,
            tax: calculatedTax,
            shipping: shippingCost,
            grandTotal: Math.max(0, grandTotal)
        };
    }, [stagedItems, discountType, discountAmount, orderTaxPct, shippingCost]);

    // Queue Actions
    const handleSuggestSerial = () => {
        const randomSerial = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
        setManualSerial(randomSerial);
    };

    const handleApplyManualItem = () => {
        if (!manualProduct || !manualVariant || !manualSerial) {
            toast.error("Please fill all manual entry fields");
            return;
        }

        const newItem: StagedPurchaseItem = {
            id: crypto.randomUUID(),
            productName: manualProduct,
            variant: manualVariant,
            sku: `SKU-${Math.floor(Math.random() * 10000)}`,
            serial: manualSerial,
            unitPrice: 25000,
            quantity: 1
        };

        setStagedItems(prev => [...prev, newItem]);
        setManualProduct("");
        setManualVariant("");
        setManualSerial("");
        toast.success("Item added to queue");
    };

    const handleRemoveItem = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: string, qty: number) => {
        if (qty < 1) return;
        setStagedItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    };

    const handleSavePurchase = () => {
        if (!supplier) return toast.error("Please select a supplier");
        if (stagedItems.length === 0) return toast.error("Queue is empty");
        toast.success("Purchase record saved successfully!");
    };

    return {
        supplier, setSupplier,
        date, setDate,
        isManualEntryOpen, toggleManualEntry,
        manualProduct, setManualProduct,
        manualVariant, setManualVariant,
        manualSerial, setManualSerial,
        stagedItems,
        discountType, setDiscountType,
        discountAmount, setDiscountAmount,
        orderTaxPct, setOrderTaxPct,
        shippingCost, setShippingCost,
        totals,
        openAddSupplierModal,
        handleSuggestSerial,
        handleApplyManualItem,
        handleRemoveItem,
        handleQuantityChange,
        handleSavePurchase
    };
}