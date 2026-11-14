import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useReviewStore } from "@/store/useReviewStore";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { Review, ReviewStatus } from "@/types/reviews";
import { summarizeReviews, toReviewRows } from "@/utils/reviewRules";

export type ReviewDrawerState = "none" | "add" | "edit" | "view";

export function useReviewManager() {
    const store = useReviewStore();
    const sales = useGlobalSalesStore((state) => state.sales);

    const [activeDrawer, setActiveDrawer] = useState<ReviewDrawerState>("none");
    const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Verified buyer is worked out from Sales every time, never stored.
    const allRows = useMemo(() => toReviewRows(store.reviews, sales), [store.reviews, sales]);
    const summary = useMemo(() => summarizeReviews(allRows), [allRows]);
    const reviews = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return q ? allRows.filter((row) => [row.productName, row.customerName, row.comment].some((text) => text.toLowerCase().includes(q))) : allRows;
    }, [allRows, searchQuery]);

    const getActiveReview = useCallback((): Review | undefined => {
        if (!activeReviewId) return undefined;
        return store.reviews.find(r => r.id === activeReviewId);
    }, [activeReviewId, store.reviews]);

    const openAddDrawer = useCallback(() => {
        setActiveReviewId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveReviewId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => setActiveDrawer("none"), []);

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
        reviews,
        summary,
        searchQuery,
        setSearchQuery,
        activeDrawer,
        activeReviewId,
        selectedIds,
        setSelectedIds,
        getActiveReview,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleStatusUpdate,
    };
}

export type ReviewManagerType = ReturnType<typeof useReviewManager>;
