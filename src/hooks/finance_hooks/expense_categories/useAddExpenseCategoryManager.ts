"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useExpenseCategoryStore } from "./useExpenseCategoryStore";

export function useAddExpenseCategoryManager() {
    const { addCategory } = useExpenseCategoryStore();

    const [name, setName] = useState("");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoUpload = () => {
        toast.info("Image upload simulated.");
        setLogoPreview("📁");
    };

    const handleSave = () => {
        if (!name.trim()) {
            return toast.error("Category name is required.");
        }

        addCategory({
            name: name.trim(),
            logo: logoPreview,
        });

        toast.success("Expense category created successfully!");
        setName("");
        setLogoPreview(null);
    };

    return {
        name,
        setName,
        logoPreview,
        handleLogoUpload,
        handleSave,
    };
}