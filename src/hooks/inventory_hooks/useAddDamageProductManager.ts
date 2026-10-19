"use client";
import { useState } from "react";
import { toast } from "sonner";

export interface DamagedSerialItem {
    id: string;
    serialNo: string;
    product: string;
    variant: string;
}

export function useAddDamageProductManager(onClose?: () => void) {
    const [shop, setShop] = useState<string>("");
    const [isEditingShop, setIsEditingShop] = useState(false);
    const [damageDate, setDamageDate] = useState("2026-10-14");
    const [note, setNote] = useState("");
    const [serialQuery, setSerialQuery] = useState("");

    const [stagedSerials, setStagedSerials] = useState<DamagedSerialItem[]>([
        {
            id: crypto.randomUUID(),
            serialNo: "SF165195KGSD0462AG",
            product: "Apple 20W USB C 3 Pin Power Adapter",
            variant: "White",
        },
    ]);

    // Auto-select shop if items exist and shop is not yet set
    const activeShop = shop || (stagedSerials.length > 0 ? "A-Block" : "");

    const handleScanSerial = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && serialQuery.trim()) {
            e.preventDefault();
            const newSerial: DamagedSerialItem = {
                id: crypto.randomUUID(),
                serialNo: serialQuery.trim().toUpperCase(),
                product: "Apple 20W USB C 3 Pin Power Adapter",
                variant: "White",
            };
            setStagedSerials((prev) => [...prev, newSerial]);
            if (!shop) setShop("A-Block");
            setSerialQuery("");
            toast.success("Serial added to damaged list.");
        }
    };

    const handleRemoveSerial = (id: string) => {
        setStagedSerials((prev) => {
            const next = prev.filter((item) => item.id !== id);
            if (next.length === 0 && !isEditingShop) setShop("");
            return next;
        });
    };

    const handleRecordDamage = () => {
        if (!activeShop) return toast.error("Please scan a serial or select a shop.");
        if (stagedSerials.length === 0) return toast.error("Please add at least one damaged serial.");
        toast.success("Damage product recorded successfully!");
        if (onClose) onClose();
    };

    return {
        shop: activeShop,
        setShop,
        isEditingShop,
        setIsEditingShop,
        damageDate,
        setDamageDate,
        note,
        setNote,
        serialQuery,
        setSerialQuery,
        stagedSerials,
        handleScanSerial,
        handleRemoveSerial,
        handleRecordDamage,
    };
}