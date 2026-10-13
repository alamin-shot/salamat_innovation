"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export interface SaleItem {
    id: string;
    productName: string;
    variant: string;
    serial: string;
    purchasePrice: number;
    mrp: number;
    salePrice: number;
    discount: number;
}

export interface PaymentMethod {
    id: string;
    amount: number;
    method: string;
}

export function useAddSaleManager() {
    const [customer, setCustomer] = useState("");
    const [seller, setSeller] = useState("");
    const [date, setDate] = useState("2026-10-12");
    const [address, setAddress] = useState("Pakutia zamidar bari, Nagarpur, Tangail, 1936");

    const [stagedItems, setStagedItems] = useState<SaleItem[]>([
        {
            id: crypto.randomUUID(),
            productName: "VOLTME PowerLink RUGG C to C",
            variant: "Black/1.8M/ 3A/ 60W",
            serial: "0000442916",
            purchasePrice: 263,
            mrp: 1200,
            salePrice: 350,
            discount: 850
        }
    ]);

    const [orderTaxPct, setOrderTaxPct] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(120);
    const [additionalChargeName, setAdditionalChargeName] = useState("");
    const [additionalChargeAmount, setAdditionalChargeAmount] = useState<number>(0);

    const [payments, setPayments] = useState<PaymentMethod[]>([
        { id: crypto.randomUUID(), amount: 0, method: "" }
    ]);

    const totals = useMemo(() => {
        const subTotal = stagedItems.reduce((acc, item) => acc + item.salePrice, 0);
        const totalDiscount = stagedItems.reduce((acc, item) => acc + item.discount, 0);
        const calculatedTax = subTotal * (orderTaxPct / 100);
        const grandTotal = subTotal + calculatedTax + shippingCost + additionalChargeAmount;

        const totalReceived = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const dueAmount = grandTotal - totalReceived;

        return {
            subTotal,
            totalDiscount,
            tax: calculatedTax,
            shipping: shippingCost,
            additionalCharge: additionalChargeAmount,
            grandTotal: Math.max(0, grandTotal),
            totalReceived,
            dueAmount: Math.max(0, dueAmount)
        };
    }, [stagedItems, orderTaxPct, shippingCost, additionalChargeAmount, payments]);

    const handleUpdateItem = (id: string, field: "salePrice" | "discount", value: number) => {
        setStagedItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            let newSalePrice = item.salePrice;
            let newDiscount = item.discount;

            if (field === "salePrice") {
                newSalePrice = value;
                newDiscount = item.mrp - value;
            } else if (field === "discount") {
                newDiscount = value;
                newSalePrice = item.mrp - value;
            }

            return { ...item, salePrice: Math.max(0, newSalePrice), discount: Math.max(0, newDiscount) };
        }));
    };

    const handleRemoveItem = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const addPaymentMethod = () => {
        setPayments(prev => [...prev, { id: crypto.randomUUID(), amount: 0, method: "" }]);
    };

    const updatePayment = (id: string, field: "amount" | "method", value: string | number) => {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSaveSale = () => {
        if (!customer) return toast.error("Please select a customer");
        if (stagedItems.length === 0) return toast.error("Cart is empty");
        toast.success("Sale saved successfully!");
    };

    return {
        customer, setCustomer,
        seller, setSeller,
        date, setDate,
        address, setAddress,
        stagedItems,
        orderTaxPct, setOrderTaxPct,
        shippingCost, setShippingCost,
        additionalChargeName, setAdditionalChargeName,
        additionalChargeAmount, setAdditionalChargeAmount,
        payments,
        totals,
        handleUpdateItem,
        handleRemoveItem,
        addPaymentMethod,
        updatePayment,
        handleSaveSale
    };
}