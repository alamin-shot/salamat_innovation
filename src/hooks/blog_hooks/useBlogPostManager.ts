"use client";
import { useState, useCallback } from "react";
import { useBlogPostStore, BlogPost } from "@/store/useBlogPostStore";
import { toast } from "sonner";

export type BlogDrawerState = "none" | "add" | "edit" | "reorder";

export function useBlogPostManager() {
    const store = useBlogPostStore();

    const [activeDrawer, setActiveDrawer] = useState<BlogDrawerState>("none");
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const getActivePost = useCallback((): BlogPost | undefined => {
        if (!activePostId) return undefined;
        return store.posts.find(p => p.id === activePostId);
    }, [activePostId, store.posts]);

    const openAddDrawer = useCallback(() => {
        setActivePostId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActivePostId(id);
        setActiveDrawer("edit");
    }, []);

    const openReorderDrawer = useCallback(() => {
        setActiveDrawer("reorder");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActivePostId(null), 300);
    }, []);

    const handleSubmit = useCallback((formData: Omit<BlogPost, "id" | "views" | "author" | "createdAt">) => {
        if (activeDrawer === "edit" && activePostId) {
            store.updatePost(activePostId, formData);
            toast.success("Blog post updated successfully");
        } else if (activeDrawer === "add") {
            store.addPost(formData);
            toast.success("New blog post created");
        }
        closeDrawer();
    }, [activeDrawer, activePostId, store, closeDrawer]);

    const handleDelete = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this blog post?")) {
            store.deletePost(id);
            toast.success("Blog post deleted");
        }
    }, [store]);

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} blog posts?`)) {
            store.bulkDeletePosts(selectedIds);
            setSelectedIds([]);
            toast.success("Blog posts deleted");
        }
    }, [selectedIds, store]);

    const handleReorder = useCallback((reordered: BlogPost[]) => {
        store.reorderPosts(reordered);
        toast.success("Posts reordered successfully");
        closeDrawer();
    }, [store, closeDrawer]);

    // NEW: Handles the dropdown quick actions from the table
    const handleQuickAction = useCallback((id: string, action: string) => {
        const post = store.posts.find(p => p.id === id);
        if (!post) return;

        const updates: Partial<BlogPost> = {};
        switch (action) {
            case "Publish": updates.isPublished = true; break;
            case "Unpublish": updates.isPublished = false; break;
            case "Toggle Featured": updates.isFeatured = !post.isFeatured; break;
            case "Toggle Trending": updates.isTrending = !post.isTrending; break;
            case "Toggle Popular": updates.isPopular = !post.isPopular; break;
            default: return;
        }

        store.updatePost(id, updates);
        toast.success(`Post updated: ${action}`);
    }, [store]);

    return {
        posts: store.posts,
        activeDrawer,
        activePostId,
        selectedIds,
        setSelectedIds,
        getActivePost,
        openAddDrawer,
        openEditDrawer,
        openReorderDrawer,
        closeDrawer,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleReorder,
        handleQuickAction
    };
}

export type BlogPostManagerType = ReturnType<typeof useBlogPostManager>;