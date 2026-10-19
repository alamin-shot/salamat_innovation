"use client";
import { useState } from "react";
import { toast } from "sonner";

export function usePeopleFormManager(onClose?: () => void) {
    const [isCustomer, setIsCustomer] = useState(true);
    const [isSupplier, setIsSupplier] = useState(false);

    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState("");
    const [secondaryPhone, setSecondaryPhone] = useState("");
    const [email, setEmail] = useState("");

    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [businessLogo, setBusinessLogo] = useState<string | null>(null);

    const [country, setCountry] = useState("");
    const [district, setDistrict] = useState("");
    const [area, setArea] = useState("");
    const [thana, setThana] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [streetAddress, setStreetAddress] = useState("");

    const handleSave = () => {
        if (!isCustomer && !isSupplier) {
            return toast.error("Please select at least Customer or Supplier.");
        }
        if (!name.trim()) {
            return toast.error("Name is required.");
        }
        if (!phone.trim()) {
            return toast.error("Phone number is required.");
        }
        toast.success("Person saved successfully!");
        if (onClose) onClose();
    };

    return {
        isCustomer, setIsCustomer,
        isSupplier, setIsSupplier,
        name, setName,
        businessName, setBusinessName,
        phone, setPhone,
        secondaryPhone, setSecondaryPhone,
        email, setEmail,
        profilePicture, setProfilePicture,
        businessLogo, setBusinessLogo,
        country, setCountry,
        district, setDistrict,
        area, setArea,
        thana, setThana,
        postalCode, setPostalCode,
        streetAddress, setStreetAddress,
        handleSave,
    };
}