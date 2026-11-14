import { useState } from "react";
import { toast } from "sonner";
import { useDepositStore, Deposit } from "./useDepositStore";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";

/** Edit Deposit. Mount with `key={record.id}` so the fields start from that record. */
export function useDepositFormManager(initialRecord?: Deposit | null, onClose?: () => void) {
    const updateDeposit = useDepositStore((state) => state.updateDeposit);
    const directors = useGlobalDirectorsStore((state) => state.directors);

    const [title, setTitle] = useState(initialRecord?.title ?? "");
    const [date, setDate] = useState(initialRecord?.date ?? "");
    const [amount, setAmount] = useState<number | "">(initialRecord?.amount ?? "");
    const [directorId, setDirectorId] = useState(initialRecord?.directorId ?? "");
    const [note, setNote] = useState(initialRecord?.note ?? "");

    const handleSave = () => {
        if (!title.trim() || !amount || !directorId) return toast.error("Title, Amount, and Director are required.");
        if (!directors.some((director) => director.id === directorId)) return toast.error("Choose a director from the Directors list.");

        if (initialRecord) {
            updateDeposit(initialRecord.id, { title: title.trim(), date, amount: Number(amount), directorId, note: note || "-" });
            toast.success("Deposit updated successfully!");
        }
        onClose?.();
    };

    return { title, setTitle, date, setDate, amount, setAmount, directorId, setDirectorId, note, setNote, handleSave };
}
