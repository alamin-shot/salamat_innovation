"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { usePartnerStore, Partner, PartnerType } from "@/store/usePartnerStore";

export function useSharedPartnerForm(partnerType: PartnerType, initialRecord: Partner | null, onClose: () => void) {
    const { addPartner, updatePartner } = usePartnerStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [primaryPhone, setPrimaryPhone] = useState("");
    const [secondaryPhone, setSecondaryPhone] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [tradeLicense, setTradeLicense] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Active");
    const [logo, setLogo] = useState<string | null>(null);

    useEffect(() => {
        if (initialRecord) {
            setName(initialRecord.name); setEmail(initialRecord.email); setPrimaryPhone(initialRecord.primaryPhone);
            setSecondaryPhone(initialRecord.secondaryPhone); setBusinessName(initialRecord.businessName);
            setTradeLicense(initialRecord.tradeLicense); setAddress(initialRecord.address);
            setStatus(initialRecord.status); setLogo(initialRecord.logo);
        } else {
            setName(""); setEmail(""); setPrimaryPhone(""); setSecondaryPhone("");
            setBusinessName(""); setTradeLicense(""); setAddress(""); setStatus("Active"); setLogo(null);
        }
    }, [initialRecord]);

    // Real File Upload simulation via hidden input
    const triggerLogoUpload = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("File size must be under 2MB");
            const url = URL.createObjectURL(file);
            setLogo(url); // Preview the real image
        }
    };

    const handleSave = () => {
        if (!name.trim() || !primaryPhone.trim() || !businessName.trim() || !status) {
            return toast.error("Name, Primary Phone, Business Name, and Status are required.");
        }

        const payload = {
            type: partnerType, name: name.trim(), email: email.trim() || "-", primaryPhone: primaryPhone.trim(),
            secondaryPhone: secondaryPhone.trim() || "-", businessName: businessName.trim(),
            tradeLicense: tradeLicense.trim() || "-", address: address.trim() || "-", status, logo
        };

        if (initialRecord) {
            updatePartner(initialRecord.id, payload);
            toast.success(`${partnerType} updated successfully!`);
        } else {
            addPartner(payload);
            toast.success(`${partnerType} added successfully!`);
        }
        onClose();
    };

    return {
        name, setName, email, setEmail, primaryPhone, setPrimaryPhone,
        secondaryPhone, setSecondaryPhone, businessName, setBusinessName,
        tradeLicense, setTradeLicense, address, setAddress, status, setStatus,
        logo, fileInputRef, triggerLogoUpload, handleFileChange, handleSave
    };
}