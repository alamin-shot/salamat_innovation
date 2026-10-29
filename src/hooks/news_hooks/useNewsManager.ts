"use client";
import { useState, useCallback } from "react";
import { useNewsStore, NewsArticle } from "@/store/useNewsStore";
import { toast } from "sonner";

export type NewsDrawerState = "none" | "add" | "edit";

export function useNewsManager() {
    const store = useNewsStore();

    const [activeDrawer, setActiveDrawer] = useState<NewsDrawerState>("none");
    const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveArticle = useCallback((): NewsArticle | undefined => {
        if (!activeArticleId) return undefined;
        return store.articles.find(a => a.id === activeArticleId);
    }, [activeArticleId, store.articles]);

    const openAddDrawer = useCallback(() => {
        setActiveArticleId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveArticleId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveArticleId(null), 300);
    }, []);

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = useCallback((formData: Omit<NewsArticle, "id">) => {
        // Auto-generate slug if empty
        const finalData = { ...formData };
        if (!finalData.slug.trim()) {
            finalData.slug = generateSlug(finalData.name);
        }

        if (activeDrawer === "add") {
            store.addArticle(finalData);
            toast.success("News article created successfully");
        } else if (activeDrawer === "edit" && activeArticleId) {
            store.updateArticle(activeArticleId, finalData);
            toast.success("News article updated successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeArticleId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this article?")) {
            store.deleteArticle(id);
            toast.success("Article deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} articles?`)) {
            store.bulkDeleteArticles(selectedIds);
            setSelectedIds([]);
            toast.success("Articles deleted");
        }
    }, [selectedIds, store]);

    return {
        articles: store.articles,
        activeDrawer,
        activeArticleId,
        selectedIds,
        setSelectedIds,
        getActiveArticle,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        generateSlug
    };
}

export type NewsManagerType = ReturnType<typeof useNewsManager>;