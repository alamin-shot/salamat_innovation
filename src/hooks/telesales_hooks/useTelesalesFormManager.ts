"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TelesaleRecord } from "./useTelesalesManager";

export function useTelesalesFormManager(
    mode: "create" | "edit",
    initialRecord?: TelesaleRecord | null,
    onClose?: () => void
) {
    const [isManualCustomer, setIsManualCustomer] = useState(false);
    const [isManualProduct, setIsManualProduct] = useState(false);

    const [date, setDate] = useState("2026-10-19");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [manualCustomerNumber, setManualCustomerNumber] = useState("");
    const [manualCustomerName, setManualCustomerName] = useState("");

    const [customerDemand, setCustomerDemand] = useState("");
    const [media, setMedia] = useState("");
    const [result, setResult] = useState("");
    const [salesmanName, setSalesmanName] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (mode === "edit" && initialRecord) {
            setIsManualCustomer(true);
            setIsManualProduct(false);
            setDate("2026-10-15");
            setManualCustomerNumber(initialRecord.customerNumber);
            setManualCustomerName(initialRecord.customer);
            setSelectedCustomer(initialRecord.customer);
            setCustomerDemand(initialRecord.customerDemand);
            setMedia(initialRecord.media === "-" ? "" : initialRecord.media);
            setResult(initialRecord.result);
            setSalesmanName(initialRecord.salesmanName === "-" ? "" : initialRecord.salesmanName);
            setAddress(initialRecord.address === "-" ? "" : initialRecord.address);
            setNote(initialRecord.note);
        } else if (mode === "create") {
            setIsManualCustomer(false);
            setIsManualProduct(false);
            setDate("2026-10-19");
            setSelectedCustomer("");
            setManualCustomerNumber("");
            setManualCustomerName("");
            setCustomerDemand("");
            setMedia("");
            setResult("");
            setSalesmanName("");
            setAddress("");
            setNote("");
        }
    }, [mode, initialRecord]);

    const handleSave = () => {
        if (!date) return toast.error("Date is required.");
        if (!isManualCustomer && !selectedCustomer) {
            return toast.error("Please choose a customer.");
        }
        if (isManualCustomer && !manualCustomerNumber.trim()) {
            return toast.error("Customer number is required.");
        }
        toast.success(
            mode === "edit"
                ? "Telesale updated successfully!"
                : "Telesale created successfully!"
        );
        if (onClose) onClose();
    };

    return {
        isManualCustomer,
        setIsManualCustomer,
        isManualProduct,
        setIsManualProduct,
        date,
        setDate,
        selectedCustomer,
        setSelectedCustomer,
        manualCustomerNumber,
        setManualCustomerNumber,
        manualCustomerName,
        setManualCustomerName,
        customerDemand,
        setCustomerDemand,
        media,
        setMedia,
        result,
        setResult,
        salesmanName,
        setSalesmanName,
        address,
        setAddress,
        note,
        setNote,
        handleSave,
    };
}