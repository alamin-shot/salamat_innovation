"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDirectorStore } from "./useDirectorStore";

export function useAddDirectorManager() {
    const { addDirector } = useDirectorStore();
    const [shop, setShop] = useState("");
    const [name, setName] = useState("");

    const handleSave = () => {
        if (!shop) return toast.error("Shop is required.");
        if (!name.trim()) return toast.error("Director name is required.");
        addDirector({ shop, name: name.trim(), avatar: name.trim().substring(0, 2).toUpperCase() });
        toast.success("Director added successfully!");
        setShop(""); setName("");
    };
    return { shop, setShop, name, setName, handleSave };
}