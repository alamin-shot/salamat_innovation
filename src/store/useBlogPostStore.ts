import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    tags: string[]; // Array for multi-select
    excerpt: string;
    content: string; // HTML string for Rich Text
    thumbnailUrl: string | null;
    bannerUrl: string | null;
    readingTime: number;
    publishedAt: string; // ISO string representing Date & Time
    isPublished: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    isPopular: boolean;
    metaTitle: string;
    metaDescription: string;
    metaTags: string; // Comma separated string
    views: number;
    author: string;
    createdAt: string;
}

interface BlogPostStore {
    posts: BlogPost[];
    addPost: (post: Omit<BlogPost, "id" | "views" | "author" | "createdAt">) => void;
    updatePost: (id: string, updatedData: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;
    bulkDeletePosts: (ids: string[]) => void;
    reorderPosts: (reorderedPosts: BlogPost[]) => void;
}

export const useBlogPostStore = create<BlogPostStore>()(
    persist(
        (set) => ({
            posts: [
                {
                    id: "1",
                    title: "How to Check Battery Health on Android",
                    category: "Brand Spotlight",
                    tags: ["Android", "Battery", "Guide"],
                    excerpt: "Learn the best ways to check your phone's battery health.",
                    content: "<p>Your Android smartphone's battery plays a major role...</p>",
                    thumbnailUrl: null,
                    bannerUrl: null,
                    readingTime: 5,
                    publishedAt: "2026-10-01T12:41:00.000Z",
                    isPublished: true,
                    isFeatured: false,
                    isTrending: false,
                    isPopular: false,
                    metaTitle: "How to Check Battery Health on Android (2026 Guide)",
                    metaDescription: "Learn how to check battery health on Android phones...",
                    metaTags: "Android battery health check, check Android battery capacity",
                    views: 1,
                    author: "Admin",
                    createdAt: "2026-10-01T10:00:00.000Z"
                },
                {
                    id: "2",
                    title: "Why Fast Chargers Matter ?",
                    category: "Top Picks",
                    tags: ["Charger", "Fast Charging"],
                    excerpt: "Discover the technology behind fast chargers.",
                    content: "<p>Fast charging is no longer a luxury, it is a necessity...</p>",
                    thumbnailUrl: null,
                    bannerUrl: null,
                    readingTime: 4,
                    publishedAt: "2026-09-29T17:37:00.000Z",
                    isPublished: true,
                    isFeatured: false,
                    isTrending: true,
                    isPopular: false,
                    metaTitle: "Why Fast Chargers Matter in 2026",
                    metaDescription: "A deep dive into GaN technology and fast chargers.",
                    metaTags: "fast charger, GaN charger, quick charge",
                    views: 24,
                    author: "Masuma Rahman",
                    createdAt: "2026-09-28T10:00:00.000Z"
                }
            ],
            addPost: (postData) => set((state) => ({
                posts: [...state.posts, {
                    ...postData,
                    id: Date.now().toString(),
                    views: 0,
                    author: "Admin", // Hardcoded for demo, normally pulled from auth session
                    createdAt: new Date().toISOString()
                }]
            })),
            updatePost: (id, updatedData) => set((state) => ({
                posts: state.posts.map(post => post.id === id ? { ...post, ...updatedData } : post)
            })),
            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(post => post.id !== id)
            })),
            bulkDeletePosts: (ids) => set((state) => ({
                posts: state.posts.filter(post => !ids.includes(post.id))
            })),
            reorderPosts: (reorderedPosts) => set(() => ({
                posts: reorderedPosts
            }))
        }),
        { name: "erp-blog-post-storage-v1" }
    )
);