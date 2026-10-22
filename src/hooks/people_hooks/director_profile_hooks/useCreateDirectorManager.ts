"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDirectorProfileStore } from "./useDirectorProfileStore";

export function useCreateDirectorManager() {
    const { addProfile } = useDirectorProfileStore();

    const [fullName, setFullName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handlePhotoUpload = () => {
        toast.info("Simulating photo upload...");
        setAvatar(fullName ? fullName.substring(0, 2).toUpperCase() : "Pic");
    };

    const handleSave = () => {
        if (!fullName.trim() || !title.trim() || !email.trim() || !phone.trim() || !password.trim()) {
            return toast.error("All required fields must be filled.");
        }

        addProfile({
            fullName: fullName.trim(),
            title: title.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            avatar: avatar || fullName.substring(0, 2).toUpperCase()
        });

        toast.success("Director Profile created successfully!");
        setFullName(""); setTitle(""); setEmail(""); setPhone(""); setPassword(""); setAvatar(null);
    };

    return { fullName, setFullName, title, setTitle, email, setEmail, phone, setPhone, password, setPassword, showPassword, togglePasswordVisibility, avatar, handlePhotoUpload, handleSave };
}