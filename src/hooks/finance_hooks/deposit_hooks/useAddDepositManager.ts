"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDepositStore } from "./useDepositStore";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";

export function useAddDepositManager() {
    const { addDeposit } = useDepositStore();
    const directors = useGlobalDirectorsStore((state) => state.directors);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState<number | "">("");
    const [directorId, setDirectorId] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!title.trim() || !amount || !directorId) {
            return toast.error("Title, Amount, and Director are required.");
        }

        const selectedDirector = directors.find(d => d.id === directorId);
        if (!selectedDirector) return toast.error("Choose a director from the Directors list.");

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
        setDirectorId("");
        setNote("");
    };

    return { title, setTitle, date, setDate, amount, setAmount, directorId, setDirectorId, note, setNote, handleSave };
}