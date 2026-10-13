"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export interface AddReturnItem {
    id: string;
    productName: string;
    sku: string;
    serial: string;
    unitPrice: number;
    receivedAmount: number;
}

export function useAddSaleReturnManager() {
    // Starts empty as shown in the design
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Defaults to today

    const [stagedItems, setStagedItems] = useState<AddReturnItem[]>([]);

    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [globalDiscount, setGlobalDiscount] = useState<number>(0); // Powers the summary discount

    const totals = useMemo(() => {
        const subTotal = stagedItems.reduce((acc, item) => acc + (item.receivedAmount || 0), 0);

        const calculatedTax = (subTotal - globalDiscount) * (orderTaxPct / 100);
        const grandTotal = (subTotal - globalDiscount) + calculatedTax + shippingCost;

        return {
            subTotal,
            discount: globalDiscount,
            tax: calculatedTax,
            shipping: shippingCost,
            grandTotal: Math.max(0, grandTotal)
        };
    }, [stagedItems, orderTaxPct, shippingCost, globalDiscount]);

    const handleRemoveItem = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        if (stagedItems.length === 0) return toast.error("Please add at least one product to return.");
        toast.success("Sale Return created successfully!");
    };

    return {
        customer, setCustomer,
        date, setDate,
        stagedItems, setStagedItems,
        orderTaxPct, setOrderTaxPct,
        shippingCost, setShippingCost,
        totals,
        handleRemoveItem,
        handleSave
    };
}