"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export interface ReturnItem {
    id: string;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    isFixedDiscount: boolean;
}

export function useSaleReturnManager() {
    const [customer, setCustomer] = useState("MD MINHAZUL ISLAM RIFAT");
    const [date, setDate] = useState("2026-10-10");

    const [stagedItems, setStagedItems] = useState<ReturnItem[]>([
        {
            id: crypto.randomUUID(),
            productName: "QCY Type C-L 27W Charging Cable",
            variant: "Black",
            sku: "SI-588128987",
            serial: "4516192621",
            unitPrice: 550,
            quantity: 1,
            discount: 50,
            isFixedDiscount: true
        },
        {
            id: crypto.randomUUID(),
            productName: "QCY Type C-L 27W Charging Cable",
            variant: "Black",
            sku: "SI-588128987",
            serial: "7627187010",
            unitPrice: 550,
            quantity: 1,
            discount: 50,
            isFixedDiscount: true
        }
    ]);

    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);

    const totals = useMemo(() => {
        let subTotal = 0;
        let totalDiscount = 0;

        stagedItems.forEach(item => {
            const rowGross = item.unitPrice * item.quantity;
            let rowDiscount = item.isFixedDiscount ? item.discount : rowGross * (item.discount / 100);

            subTotal += rowGross;
            totalDiscount += rowDiscount;
        });

        const calculatedTax = (subTotal - totalDiscount) * (orderTaxPct / 100);
        const grandTotal = (subTotal - totalDiscount) + calculatedTax + shippingCost;

        return {
            subTotal,
            totalDiscount,
            tax: calculatedTax,
            shipping: shippingCost,
            grandTotal: Math.max(0, grandTotal)
        };
    }, [stagedItems, orderTaxPct, shippingCost]);

    const handleUpdateItem = (id: string, field: keyof ReturnItem, value: any) => {
        setStagedItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        toast.success("Return updated successfully!");
    };

    return {
        customer, setCustomer,
        date, setDate,
        stagedItems,
        orderTaxPct, setOrderTaxPct,
        shippingCost, setShippingCost,
        totals,
        handleUpdateItem,
        handleRemoveItem,
        handleSave
    };
}