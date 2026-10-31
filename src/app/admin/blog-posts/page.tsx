import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { BlogPostClient } from "@/components/features/blog-posts/BlogPostClient";

export const metadata = {
    title: "Blog Posts | Salamat Innovation ERP",
};

export default function BlogPostsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BlogPostClient />
        </Suspense>
    );
}