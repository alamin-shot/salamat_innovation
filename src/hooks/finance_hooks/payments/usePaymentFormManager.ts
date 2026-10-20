"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAddPaymentStore } from "./useAddPaymentStore";

export function usePaymentFormManager(
    type: "receive" | "send",
    recordId: string | null,
    onClose: () => void
) {
    const { processPayment } = useAddPaymentStore();

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [note, setNote] = useState("");

    useEffect(() => {
        setDate(new Date().toISOString().split("T")[0]);
        setPaymentMethod("");
        setAmount("");
        setNote("");
    }, [recordId, type]);

    const handleSave = () => {
        if (!recordId) return;
        if (!paymentMethod) return toast.error("Payment method is required.");
        if (!amount || Number(amount) <= 0) return toast.error("Valid amount is required.");

        processPayment(recordId, type, Number(amount));
        toast.success(type === "receive" ? "Payment received successfully!" : "Payment sent successfully!");
        onClose();
    };

    return {
        date,
        setDate,
        paymentMethod,
        setPaymentMethod,
        amount,
        setAmount,
        note,
        setNote,
        handleSave,
    };
}