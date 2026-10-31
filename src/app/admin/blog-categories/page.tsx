import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { BlogCategoryClient } from "@/components/features/blog/BlogCategoryClient";

export const metadata = { title: "Blog Categories | Salamat Innovation ERP" };

export default function BlogCategoriesPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
            <BlogCategoryClient />
        </Suspense>
    );
}