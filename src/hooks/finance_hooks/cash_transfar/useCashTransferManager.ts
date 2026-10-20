"use client";
import { useState } from "react";
import { toast } from "sonner";

export function useCashTransferManager() {
    const [fromShop, setFromShop] = useState("TEKZO JFP 4A-018A");
    const [toShop, setToShop] = useState("TEKZO JFP 4A-018A");
    const [amount, setAmount] = useState<number | "">(400);
    const [transferDate, setTransferDate] = useState("2026-10-13");
    const [note, setNote] = useState("");

    const handleCreate = () => {
        if (!fromShop || !toShop) return toast.error("Please select both source and destination shops.");
        if (!amount || Number(amount) <= 0) return toast.error("Please enter a valid transfer amount.");
        toast.success("Cash transfer created successfully!");
    };

    return {
        fromShop, setFromShop,
        toShop, setToShop,
        amount, setAmount,
        transferDate, setTransferDate,
        note, setNote,
        handleCreate
    };
}