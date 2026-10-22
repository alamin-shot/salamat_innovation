"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDirectorProfileStore, DirectorProfile } from "./useDirectorProfileStore";

export function useDirectorFormManager(initialRecord?: DirectorProfile | null, onClose?: () => void) {
    const { updateProfile } = useDirectorProfileStore();

    const [fullName, setFullName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (initialRecord) {
            setFullName(initialRecord.fullName);
            setTitle(initialRecord.title);
            setEmail(initialRecord.email);
            setPhone(initialRecord.phone);
            setPassword(initialRecord.password);
            setAvatar(initialRecord.avatar);
        }
    }, [initialRecord]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const handlePhotoUpload = () => {
        toast.info("Simulating photo upload...");
        setAvatar(fullName ? fullName.substring(0, 2).toUpperCase() : "Pic");
    };

    const handleSave = () => {
        if (!fullName.trim() || !title.trim() || !email.trim() || !phone.trim() || !password.trim()) {
            return toast.error("All required fields must be filled.");
        }

        if (initialRecord) {
            updateProfile(initialRecord.id, {
                fullName: fullName.trim(), title: title.trim(), email: email.trim(), phone: phone.trim(), password, avatar
            });
            toast.success("Profile updated successfully!");
        }
        if (onClose) onClose();
    };

    return { fullName, setFullName, title, setTitle, email, setEmail, phone, setPhone, password, setPassword, showPassword, togglePasswordVisibility, avatar, handlePhotoUpload, handleSave };
}