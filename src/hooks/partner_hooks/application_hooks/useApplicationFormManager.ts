"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useApplicationStore, Application } from "./useApplicationStore";

export function useApplicationFormManager(initialRecord?: Application | null, onClose?: () => void) {
    const { addApplication, updateApplication } = useApplicationStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Pending");

    useEffect(() => {
        if (initialRecord) {
            setName(initialRecord.name);
            setEmail(initialRecord.email);
            setPhone(initialRecord.phone);
            setAddress(initialRecord.address);
            setStatus(initialRecord.status);
        } else {
            setName(""); setEmail(""); setPhone(""); setAddress(""); setStatus("Pending");
        }
    }, [initialRecord]);

    const handleSave = () => {
        if (!name.trim() || !phone.trim() || !status) {
            return toast.error("Name, Phone, and Status are required.");
        }

        const payload = {
            name: name.trim(),
            email: email.trim() || "-",
            phone: phone.trim(),
            address: address.trim() || "-",
            status
        };

        if (initialRecord) {
            updateApplication(initialRecord.id, payload);
            toast.success("Application updated successfully!");
        } else {
            addApplication(payload);
            toast.success("Application added successfully!");
        }

        if (onClose) onClose();
    };

    return {
        name, setName, email, setEmail, phone, setPhone,
        address, setAddress, status, setStatus, handleSave
    };
}