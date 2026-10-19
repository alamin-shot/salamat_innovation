"use client";
import { useState } from "react";
import { toast } from "sonner";

export interface StagedBarcode {
    id: string;
    productName: string;
    attribute: string;
    sku: string;
    retailPrice: number;
    quantity: number;
}

export function useCreateBarcodeManager() {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedAttribute, setSelectedAttribute] = useState("");
    const [stagedItems, setStagedItems] = useState<StagedBarcode[]>([]);

    const handleAddToQueue = () => {
        if (!selectedProduct || !selectedAttribute) {
            toast.error("Please select both a product and an attribute.");
            return;
        }

        const newItem: StagedBarcode = {
            id: Math.random().toString(36).substring(7),
            productName: selectedProduct,
            attribute: selectedAttribute,
            sku: `SKU-${Math.floor(Math.random() * 10000)}`,
            retailPrice: 2500,
            quantity: 1,
        };

        setStagedItems(prev => [...prev, newItem]);
        setSelectedProduct("");
        setSelectedAttribute("");
        toast.success("Added to generation queue");
    };

    const handleRemoveFromQueue = (id: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: string, newQty: number) => {
        if (newQty < 1) return;
        setStagedItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    };

    const handleGenerateBarcodes = () => {
        if (stagedItems.length === 0) {
            toast.error("No items in queue to generate.");
            return;
        }
        toast.success(`Successfully generated barcodes for ${stagedItems.length} items.`);
        setStagedItems([]);
    };

    return {
        selectedProduct,
        setSelectedProduct,
        selectedAttribute,
        setSelectedAttribute,
        stagedItems,
        handleAddToQueue,
        handleRemoveFromQueue,
        handleQuantityChange,
        handleGenerateBarcodes
    };
}