import { useState } from "react";
import { toast } from "sonner";
import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { usePeopleStore } from "@/store/usePeopleStore";
import { PaymentPartyRow } from "@/types/payments";
import { PAYMENT_ERRORS } from "@/constants/payments";

const today = () => new Date().toISOString().split("T")[0];

/**
 * Receive / Send Payment form. Saving posts one manual Payment record for the person.
 * Mount with a key per person + direction so every opening starts empty.
 */
export function usePaymentFormManager(direction: "receive" | "send", record: PaymentPartyRow | null, onClose: () => void) {
    const addPayment = useGlobalPaymentsStore((state) => state.addPayment);
    const person = usePeopleStore((state) => state.people.find((candidate) => candidate.id === record?.id) ?? null);

    const [date, setDate] = useState(today);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!person) return toast.error(PAYMENT_ERRORS.party_required);
        const result = addPayment({
            personId: person.id,
            contact: person.name,
            contactPhone: person.phoneNumber !== "-" ? person.phoneNumber : null,
            businessName: person.businessName,
            date,
            type: direction === "receive" ? "payment received" : "payment sent",
            amount: Number(amount),
            method: paymentMethod,
            invoiceRef: null,
            source: "manual",
            note,
        });
        if (!result.ok) return toast.error(PAYMENT_ERRORS[result.error]);
        toast.success(`${result.record.number}: ${direction === "receive" ? "payment received from" : "payment sent to"} ${person.name}.`);
        onClose();
    };

    return { date, setDate, paymentMethod, setPaymentMethod, amount, setAmount, note, setNote, handleSave };
}

export type PaymentFormManager = ReturnType<typeof usePaymentFormManager>;
