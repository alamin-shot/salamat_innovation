import { useState } from "react";
import { toast } from "sonner";
import { useWithdrawalStore, Withdrawal } from "./useWithdrawalStore";
import { useGlobalDirectorsStore } from "@/store/useGlobalDirectorsStore";

/** Edit Withdrawal. Mount with `key={record.id}` so the fields start from that record. */
export function useWithdrawalFormManager(initialRecord?: Withdrawal | null, onClose?: () => void) {
    const updateWithdrawal = useWithdrawalStore((state) => state.updateWithdrawal);
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
            updateWithdrawal(initialRecord.id, { title: title.trim(), date, amount: Number(amount), directorId, note: note || "-" });
            toast.success("Withdrawal updated successfully!");
        }
        onClose?.();
    };

    return { title, setTitle, date, setDate, amount, setAmount, directorId, setDirectorId, note, setNote, handleSave };
}
