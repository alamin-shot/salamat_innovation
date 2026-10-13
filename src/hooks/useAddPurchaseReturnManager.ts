"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export interface StagedReturnItem {
    id: string;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    unitPrice: number;
    quantity: number;
}

export function useAddPurchaseReturnManager() {
    // Form Meta State
    const [date, setDate] = useState("2026-10-12");

    // Manual Entry State
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [manualProduct, setManualProduct] = useState("");
    const [manualVariant, setManualVariant] = useState("");
    const [manualSerial, setManualSerial] = useState("");

    // Queue State
    const [stagedItems, setStagedItems] = useState<StagedReturnItem[]>([]);

    // Financial State
    const [discountType, setDiscountType] = useState("");
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);

    const toggleManualEntry = () => setIsManualEntryOpen(prev => !prev);

    // Math Engine
    const totals = useMemo(() => {
        const subTotal = stagedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        const calculatedDiscount = discountType === "Percentage"
            ? subTotal * (discountAmount / 100)
            : discountAmount;
        const calculatedTax = subTotal * (orderTaxPct / 100);
        const grandTotal = Math.max(0, subTotal - calculatedDiscount + calculatedTax + shippingCost);

        return {
            subTotal,
            discount: calculatedDiscount,
            tax: calculatedTax,
            shipping: shippingCost,
            grandTotal
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

        const newItem: StagedReturnItem = {
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
        toast.success("Item added to return queue");
    };

    const handleRemoveItem = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: string, qty: number) => {
        if (qty < 1) return;
        setStagedItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    };

    const handleSaveReturn = () => {
        if (stagedItems.length === 0) return toast.error("Return queue is empty");
        toast.success("Purchase return saved successfully!");
    };

    return {
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
        handleSuggestSerial,
        handleApplyManualItem,
        handleRemoveItem,
        handleQuantityChange,
        handleSaveReturn
    };
}