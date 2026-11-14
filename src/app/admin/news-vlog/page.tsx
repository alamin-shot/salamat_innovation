import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { NewsVlogClient } from "@/components/features/news-vlog/NewsVlogClient";

export const metadata: Metadata = {
    title: "News & Vlog | Salamat Innovation ERP",
    description: "News articles and video vlogs for the storefront.",
};

export default function NewsVlogPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <NewsVlogClient />
        </Suspense>
    );
}
