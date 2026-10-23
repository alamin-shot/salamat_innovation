"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRetailerStore, Retailer } from "./useRetailerStore";

export function useRetailerFormManager(initialRecord?: Retailer | null, onClose?: () => void) {
    const { addRetailer, updateRetailer } = useRetailerStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [primaryPhone, setPrimaryPhone] = useState("");
    const [secondaryPhone, setSecondaryPhone] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [tradeLicense, setTradeLicense] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Active"); // Default state for CustomSelect
    const [logo, setLogo] = useState<string | null>(null);

    useEffect(() => {
        if (initialRecord) {
            setName(initialRecord.name);
            setEmail(initialRecord.email);
            setPrimaryPhone(initialRecord.primaryPhone);
            setSecondaryPhone(initialRecord.secondaryPhone);
            setBusinessName(initialRecord.businessName);
            setTradeLicense(initialRecord.tradeLicense);
            setAddress(initialRecord.address);
            setStatus(initialRecord.status);
            setLogo(initialRecord.logo);
        } else {
            setName(""); setEmail(""); setPrimaryPhone(""); setSecondaryPhone("");
            setBusinessName(""); setTradeLicense(""); setAddress(""); setStatus("Active"); setLogo(null);
        }
    }, [initialRecord]);

    const handleLogoUpload = () => {
        toast.info("Simulating logo upload...");
        setLogo(name ? name.substring(0, 2).toUpperCase() : "IMG");
    };

    const handleSave = () => {
        if (!name.trim() || !primaryPhone.trim() || !businessName.trim() || !status) {
            return toast.error("Name, Primary Phone, Business Name, and Status are required.");
        }

        const payload = {
            name: name.trim(),
            email: email.trim() || "-",
            primaryPhone: primaryPhone.trim(),
            secondaryPhone: secondaryPhone.trim() || "-",
            businessName: businessName.trim(),
            tradeLicense: tradeLicense.trim() || "-",
            address: address.trim() || "-",
            status,
            logo
        };

        if (initialRecord) {
            updateRetailer(initialRecord.id, payload);
            toast.success("Retailer updated successfully!");
        } else {
            addRetailer(payload);
            toast.success("Retailer added successfully!");
        }

        if (onClose) onClose();
    };

    return {
        name, setName, email, setEmail, primaryPhone, setPrimaryPhone,
        secondaryPhone, setSecondaryPhone, businessName, setBusinessName,
        tradeLicense, setTradeLicense, address, setAddress, status, setStatus,
        logo, handleLogoUpload, handleSave
    };
}