"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useExpenseCategoryStore, ExpenseCategory } from "./useExpenseCategoryStore";

export function useExpenseCategoryFormManager(
    initialRecord?: ExpenseCategory | null,
    onClose?: () => void
) {
    const { updateCategory } = useExpenseCategoryStore();

    const [name, setName] = useState("");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialRecord) {
            setName(initialRecord.name);
            setLogoPreview(initialRecord.logo);
        }
    }, [initialRecord]);

    const handleLogoUpload = () => {
        toast.info("Image upload simulated.");
        setLogoPreview("🖼️");
    };

    const handleSave = () => {
        if (!name.trim()) return toast.error("Category name is required.");

        if (initialRecord) {
            updateCategory(initialRecord.id, {
                name: name.trim(),
                logo: logoPreview,
            });
            toast.success("Category updated successfully!");
        }

        if (onClose) onClose();
    };

    return {
        name, setName,
        logoPreview, handleLogoUpload,
        handleSave,
    };
}