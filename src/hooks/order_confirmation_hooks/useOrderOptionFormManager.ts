"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOrderOptionsStore, OrderOptionItem } from "./useOrderOptionsStore";

export function useOrderOptionFormManager(
    mode: "create" | "edit",
    initialRecord?: OrderOptionItem | null,
    onClose?: () => void
) {
    const { addOption, updateOption } = useOrderOptionsStore();

    const [type, setType] = useState<OrderOptionItem["type"]>("Advance Media");
    const [name, setName] = useState("");
    const [color, setColor] = useState<OrderOptionItem["color"]>("Grey");
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (mode === "edit" && initialRecord) {
            setType(initialRecord.type);
            setName(initialRecord.name);
            setColor(initialRecord.color);
            setSortOrder(initialRecord.sortOrder);
            setIsActive(initialRecord.status === "Active");
        } else if (mode === "create") {
            setType("Advance Media");
            setName("");
            setColor("Grey");
            setSortOrder(0);
            setIsActive(true);
        }
    }, [mode, initialRecord]);

    const handleSave = () => {
        if (!name.trim()) return toast.error("Name is required.");

        const payload = {
            type,
            name: name.trim(),
            color,
            sortOrder: Number(sortOrder) || 0,
            status: isActive ? ("Active" as const) : ("Inactive" as const),
        };

        if (mode === "edit" && initialRecord) {
            updateOption(initialRecord.id, payload);
            toast.success("Option updated successfully!");
        } else {
            addOption(payload);
            toast.success("Option created successfully!");
        }

        if (onClose) onClose();
    };

    return {
        type,
        setType,
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