"use client";
import { useState } from "react";
import { toast } from "sonner";

export interface TransferSerial {
    id: string;
    serialNo: string;
    product: string;
    variant: string;
}

export function useStockTransferManager() {
    const [fromShop, setFromShop] = useState("TEKZO JFP 4A-018A");
    const [toShop, setToShop] = useState("Salamat Innovation");
    const [transferDate, setTransferDate] = useState("2026-10-13");
    const [note, setNote] = useState("");

    const [stagedSerials, setStagedSerials] = useState<TransferSerial[]>([
        {
            id: crypto.randomUUID(),
            serialNo: "S/N:V212710D480008E",
            product: "VOLTME Revo 35 Duo CC",
            variant: "Black"
        }
    ]);

    const handleRemoveSerial = (id: string) => {
        setStagedSerials(prev => prev.filter(item => item.id !== id));
    };

    const handleCreate = () => {
        if (!fromShop || !toShop) return toast.error("Please select both source and destination shops.");
        if (stagedSerials.length === 0) return toast.error("Please add at least one serial number.");
        toast.success("Stock transfer created successfully!");
    };

    return {
        fromShop, setFromShop,
        toShop, setToShop,
        transferDate, setTransferDate,
        note, setNote,
        stagedSerials,
        handleRemoveSerial,
        handleCreate
    };
}