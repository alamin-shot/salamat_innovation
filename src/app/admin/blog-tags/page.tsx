import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { BlogTagClient } from "@/components/features/blog/BlogTagClient";

export const metadata = { title: "Blog Tags | Salamat Innovation ERP" };

export default function BlogTagsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BlogTagClient />
        </Suspense>
    );
}