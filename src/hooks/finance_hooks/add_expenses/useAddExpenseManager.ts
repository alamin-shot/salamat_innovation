"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useExpensesStore } from "../expenses/useExpensesStore";

export function useAddExpenseManager() {
    const { addExpense } = useExpensesStore();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState<number | "">("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!title.trim()) return toast.error("Title is required.");
        if (!date) return toast.error("Date is required.");
        if (!amount || Number(amount) <= 0) return toast.error("Valid amount is required.");
        if (!category) return toast.error("Category is required.");
        if (!paymentMethod) return toast.error("Payment method is required.");

        addExpense({
            shopName: "TEKZO A-Block",
            title: title.trim(),
            invoiceNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
            date,
            category,
            attachments: 0,
            note: note || "-",
            paymentMethod,
            amount: Number(amount),
            createdBy: "Md Zihadul Islam Sazzad",
        });

        toast.success("Expense created successfully!");
        setTitle("");
        setDate(new Date().toISOString().split("T")[0]);
        setAmount("");
        setCategory("");
        setPaymentMethod("");
        setNote("");
    };

    return {
        title, setTitle,
        date, setDate,
        amount, setAmount,
        category, setCategory,
        paymentMethod, setPaymentMethod,
        note, setNote,
        handleSave,
    };
}