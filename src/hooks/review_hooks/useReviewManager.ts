"use client";
import { useState, useCallback } from "react";
import { useReviewStore, Review, ReviewStatus } from "@/store/useReviewStore";
import { toast } from "sonner";

export type ReviewDrawerState = "none" | "edit" | "view";

export function useReviewManager() {
    const store = useReviewStore();

    const [activeDrawer, setActiveDrawer] = useState<ReviewDrawerState>("none");
    const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActiveReview = useCallback((): Review | undefined => {
        if (!activeReviewId) return undefined;
        return store.reviews.find(r => r.id === activeReviewId);
    }, [activeReviewId, store.reviews]);

    const openEditDrawer = useCallback((id: string) => {
        setActiveReviewId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveReviewId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Partial<Review>) => {
        if (activeDrawer === "edit" && activeReviewId) {
            store.updateReview(activeReviewId, formData);
            toast.success("Review updated and replied successfully");
        }
        closeDrawer();
    }, [activeDrawer, activeReviewId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            store.deleteReview(id);
            toast.success("Review deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} reviews?`)) {
            store.bulkDeleteReviews(selectedIds);
            setSelectedIds([]);
            toast.success("Reviews deleted");
        }
    }, [selectedIds, store]);

    const handleStatusUpdate = useCallback((id: string, status: ReviewStatus) => {
        store.updateStatus(id, status);
        toast.success(`Review marked as ${status}`);
    }, [store]);

    return {
        reviews: store.reviews,
        activeDrawer,
        activeReviewId,
        selectedIds,
        setSelectedIds,
        getActiveReview,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate
    };
}

export type ReviewManagerType = ReturnType<typeof useReviewManager>;