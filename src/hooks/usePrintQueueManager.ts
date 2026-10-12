"use client";
import { useState } from "react";
import { toast } from "sonner";

export interface PrintQueueItem {
    id: string;
    productName: string;
    serialNumber: string;
    mrp: number;
}

export function usePrintQueueManager() {
    const [searchCode, setSearchCode] = useState("");
    const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([]);

    // Simulates scanning a barcode or typing a code and hitting enter
    const handleAddByCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchCode.trim() !== "") {
            // Mock finding a product by code
            const newItem: PrintQueueItem = {
                id: Math.random().toString(36).substring(7),
                productName: "XIAOMI MIJIA Handheld Garment Steamer 2",
                serialNumber: searchCode.toUpperCase(),
                mrp: 2900.00,
            };

            setPrintQueue(prev => [...prev, newItem]);
            setSearchCode(""); // Clear input for the next scan
            toast.success("Added to print queue");
        }
    };

    const handleRemoveFromQueue = (id: string) => {
        setPrintQueue(prev => prev.filter(item => item.id !== id));
    };

    const handlePrint = () => {
        if (printQueue.length === 0) {
            toast.error("No items in queue to print.");
            return;
        }
        toast.success(`Sending ${printQueue.length} barcodes to the thermal printer...`);
        setPrintQueue([]); // Clear queue after printing
    };

    return {
        searchCode,
        setSearchCode,
        printQueue,
        handleAddByCode,
        handleRemoveFromQueue,
        handlePrint
    };
}