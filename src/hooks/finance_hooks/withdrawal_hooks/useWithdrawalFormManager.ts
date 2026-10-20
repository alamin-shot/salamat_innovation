"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWithdrawalStore, Withdrawal } from "./useWithdrawalStore";
import { useDirectorStore } from "./useDirectorStore";

export function useWithdrawalFormManager(initialRecord?: Withdrawal | null, onClose?: () => void) {
    const { updateWithdrawal } = useWithdrawalStore();
    const { directors } = useDirectorStore();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [categoryDirectorName, setCategoryDirectorName] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (initialRecord) {
            setTitle(initialRecord.title);
            setDate(initialRecord.date);
            setAmount(initialRecord.amount);

            const dir = directors.find(d => d.id === initialRecord.directorId);
            setCategoryDirectorName(dir?.name || "");

            setNote(initialRecord.note);
        }
    }, [initialRecord, directors]);

    const handleSave = () => {
        if (!title.trim() || !amount || !categoryDirectorName) return toast.error("Title, Amount, and Category are required.");

        const selectedDirector = directors.find(d => d.name === categoryDirectorName);
        if (!selectedDirector) return toast.error("Invalid Director selected.");

        if (initialRecord) {
            updateWithdrawal(initialRecord.id, {
                title: title.trim(),
                date,
                amount: Number(amount),
                directorId: selectedDirector.id,
                note: note || "-"
            });
            toast.success("Withdrawal updated successfully!");
        }
        if (onClose) onClose();
    };
    return { title, setTitle, date, setDate, amount, setAmount, categoryDirectorName, setCategoryDirectorName, note, setNote, handleSave };
}