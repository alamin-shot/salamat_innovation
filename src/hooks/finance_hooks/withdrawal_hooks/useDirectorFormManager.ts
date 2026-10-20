"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDirectorStore, Director } from "./useDirectorStore";

export function useDirectorFormManager(initialRecord?: Director | null, onClose?: () => void) {
    const { updateDirector } = useDirectorStore();
    const [shop, setShop] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (initialRecord) { setShop(initialRecord.shop); setName(initialRecord.name); }
    }, [initialRecord]);

    const handleSave = () => {
        if (!shop || !name.trim()) return toast.error("All fields are required.");
        if (initialRecord) {
            updateDirector(initialRecord.id, { shop, name: name.trim(), avatar: name.trim().substring(0, 2).toUpperCase() });
            toast.success("Director updated successfully!");
        }
        if (onClose) onClose();
    };
    return { shop, setShop, name, setName, handleSave };
}