"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSeoStore, SeoRecord, SeoPlatform, SeoTabType } from "@/store/useSeoStore";

export function useSharedSeoForm(
    platform: SeoPlatform,
    currentTab: SeoTabType,
    initialRecord: SeoRecord | null,
    onClose: () => void
) {
    const { addRecord, updateRecord } = useSeoStore();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaTags, setMetaTags] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive">("Active");

    const [productCategory, setProductCategory] = useState("");
    const [productBrand, setProductBrand] = useState("");

    useEffect(() => {
        if (initialRecord) {
            setName(initialRecord.name);
            setSlug(initialRecord.slug);
            setDescription(initialRecord.description);
            setMetaTitle(initialRecord.metaTitle);
            setMetaDescription(initialRecord.metaDescription);
            setMetaTags(initialRecord.metaTags);
            setStatus(initialRecord.status);
            setProductCategory(initialRecord.productCategory || "");
            setProductBrand(initialRecord.productBrand || "");
        } else {
            setName(""); setSlug(""); setDescription("");
            setMetaTitle(""); setMetaDescription(""); setMetaTags("");
            setStatus("Active"); setProductCategory(""); setProductBrand("");
        }
    }, [initialRecord]);

    const handleSave = () => {
        if (!name.trim() || !slug.trim()) {
            return toast.error("Name and Slug are required.");
        }

        const payload = {
            platform,
            type: currentTab,
            name: name.trim(),
            slug: slug.trim(),
            description,
            metaTitle,
            metaDescription,
            metaTags,
            status,
            ...(currentTab === "products" && { productCategory, productBrand })
        };

        if (initialRecord) {
            updateRecord(initialRecord.id, payload);
            toast.success(`${currentTab} updated successfully!`);
        } else {
            addRecord(payload);
            toast.success(`${currentTab} added successfully!`);
        }
        onClose();
    };

    return {
        name, setName, slug, setSlug, description, setDescription,
        metaTitle, setMetaTitle, metaDescription, setMetaDescription,
        metaTags, setMetaTags, status, setStatus,
        productCategory, setProductCategory, productBrand, setProductBrand,
        handleSave
    };
}