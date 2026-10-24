"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDepositStore } from "./useDepositStore";
import { useDirectorStore } from "../withdrawal_hooks/useDirectorStore";
import { useRouter } from "next/navigation";

export function useAddDepositManager() {
    const { addDeposit } = useDepositStore();
    const { directors } = useDirectorStore();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState<number | "">("");
    const [categoryDirectorName, setCategoryDirectorName] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!title.trim() || !amount || !categoryDirectorName) {
            return toast.error("Title, Amount, and Director are required.");
        }

        const selectedDirector = directors.find(d => d.name === categoryDirectorName);
        if (!selectedDirector) return toast.error("Invalid Director selected.");

        addDeposit({
            directorId: selectedDirector.id,
            shopName: "A-Block",
            title: title.trim(),
            date,
            contact: "-",
            attachments: 0,
            note: note || "-",
            amount: Number(amount),
            createdBy: "Md Zihadul Islam Sazzad"
        });

        toast.success("Deposit created successfully!");
        setTitle("");
        setAmount("");
        setCategoryDirectorName("");
        setNote("");
    };

    return { title, setTitle, date, setDate, amount, setAmount, categoryDirectorName, setCategoryDirectorName, note, setNote, handleSave };
}