"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTelesaleResultsStore, TelesaleResultItem } from "./useTelesaleResultsStore";

export function useTelesaleResultFormManager(
    mode: "create" | "edit",
    initialRecord?: TelesaleResultItem | null,
    onClose?: () => void
) {
    const { addResult, updateResult } = useTelesaleResultsStore();

    const [name, setName] = useState("");
    const [color, setColor] = useState<TelesaleResultItem["color"]>("Grey");
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (mode === "edit" && initialRecord) {
            setName(initialRecord.name);
            setColor(initialRecord.color);
            setSortOrder(initialRecord.sortOrder);
            setIsActive(initialRecord.status === "Active");
        } else if (mode === "create") {
            setName("");
            setColor("Grey");
            setSortOrder(0);
            setIsActive(true);
        }
    }, [mode, initialRecord]);

    const handleSave = () => {
        if (!name.trim()) return toast.error("Result name is required.");

        const payload = {
            name: name.trim(),
            color,
            sortOrder: Number(sortOrder) || 0,
            status: isActive ? ("Active" as const) : ("Inactive" as const),
        };

        if (mode === "edit" && initialRecord) {
            updateResult(initialRecord.id, payload);
            toast.success("Telesale result updated successfully!");
        } else {
            addResult(payload);
            toast.success("Telesale result created successfully!");
        }

        if (onClose) onClose();
    };

    return {
        name,
        setName,
        color,
        setColor,
        sortOrder,
        setSortOrder,
        isActive,
        setIsActive,
        handleSave,
    };
}