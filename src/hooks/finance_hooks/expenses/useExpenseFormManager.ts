"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useExpensesStore, ExpenseItem } from "./useExpensesStore";

export function useExpenseFormManager(
    initialRecord?: ExpenseItem | null,
    onClose?: () => void
) {
    const { updateExpense } = useExpensesStore();

    const [shopName, setShopName] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (initialRecord) {
            setShopName(initialRecord.shopName);
            setTitle(initialRecord.title);
            setDate(initialRecord.date);
            setCategory(initialRecord.category);
            setAmount(initialRecord.amount);
            setNote(initialRecord.note);
        }
    }, [initialRecord]);

    const handleSave = () => {
        if (!title.trim() || !amount) return toast.error("Title and Amount are required.");
        if (initialRecord) {
            updateExpense(initialRecord.id, {
                shopName, title, date, category, amount: Number(amount), note: note || "-"
            });
            toast.success("Expense updated successfully!");
        }
        if (onClose) onClose();
    };

    return {
        shopName, setShopName, title, setTitle, date, setDate,
        category, setCategory, amount, setAmount, note, setNote,
        handleSave,
    };
}